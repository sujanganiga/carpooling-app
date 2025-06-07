require("dotenv").config();
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: console.log,
  pool: {
    max: 1,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  retry: {
    max: 5,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /TimeoutError/,
      /ECONNRESET/,
    ],
  },
});

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runMigrations() {
  let retries = 3;

  while (retries > 0) {
    try {
      // Test connection first
      await sequelize.authenticate();
      console.log("Database connection established successfully.");

      // Read all migration files
      const migrationsPath = path.join(__dirname, "migrations");
      const migrationFiles = fs
        .readdirSync(migrationsPath)
        .filter((file) => file.endsWith(".js"))
        .sort();

      console.log("Starting migrations...");

      for (const file of migrationFiles) {
        console.log(`Running migration: ${file}`);
        const migration = require(path.join(migrationsPath, file));

        try {
          await migration.up(sequelize.getQueryInterface(), Sequelize);
          console.log(`✅ Successfully ran migration: ${file}`);
          // Add a small delay between migrations
          await wait(1000);
        } catch (error) {
          console.error(`❌ Error running migration ${file}:`, error);
          throw error;
        }
      }

      console.log("All migrations completed successfully!");
      break; // Exit the retry loop on success
    } catch (error) {
      console.error("Migration attempt failed:", error);
      retries--;

      if (retries > 0) {
        console.log(`Retrying... ${retries} attempts remaining`);
        await wait(5000); // Wait 5 seconds before retrying
      } else {
        console.error("All migration attempts failed");
        process.exit(1);
      }
    }
  }

  await sequelize.close();
}

runMigrations();
