require("dotenv").config();
const migration = require("./migrations/20240305_add_driver_fields");

async function runMigration() {
  try {
    console.log("Starting migration...");
    await migration.up();
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

runMigration();
