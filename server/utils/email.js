const nodemailer = require("nodemailer");
const config = require("../config/config");
//const { User } = require("../models");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: config.email.user,
    pass: config.email.password,
  },
});

exports.sendReviewNotification = async (
  reviewee,
  reviewer,
  ride,
  rating,
  comment
) => {
  try {
    const mailOptions = {
      from: `"Carpool App" <${config.email.user}>`,
      to: reviewee.email,
      subject: "You Received a New Ride Review",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4F46E5;">You Received a New Review</h2>
          <p>Hi ${reviewee.name},</p>
          <p>${reviewer.name} has reviewed your recent ride:</p>
          
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Ride Details</h3>
            <p><strong>From:</strong> ${ride.from}</p>
            <p><strong>To:</strong> ${ride.to}</p>
            <p><strong>Date:</strong> ${new Date(
              ride.departureTime
            ).toLocaleDateString()}</p>
            
            <h3>Review</h3>
            <p><strong>Rating:</strong> ${"★".repeat(rating)}${"☆".repeat(
        5 - rating
      )}</p>
            ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ""}
          </div>
          
          <p>View all your reviews on your profile page in the app.</p>
          
          <p style="margin-top: 30px;">Best regards,<br>The Carpool Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending review email:", error);
  }
};

exports.sendBookingNotificationToDriver = async (driver, passenger, ride) => {
  try {
    const mailOptions = {
      from: `"Carpool App" <${config.email.user}>`,
      to: driver.email,
      subject: "New Ride Booking Request",
      html: `
        <h2>New Booking Request</h2>
        <p>Hi ${driver.name},</p>
        <p>${passenger.name} has requested to book your ride:</p>
        <ul>
          <li><strong>From:</strong> ${ride.pickupLocation}</li>
          <li><strong>To:</strong> ${ride.dropoffLocation}</li>
          <li><strong>Date:</strong> ${new Date(
            ride.departureTime
          ).toLocaleString()}</li>
        </ul>
        <p>Please review and confirm or reject the booking in your app.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending booking notification to driver:", error);
  }
};

exports.sendBookingConfirmationToPassenger = async (
  passenger,
  driver,
  ride
) => {
  try {
    const mailOptions = {
      from: `"Carpool App" <${config.email.user}>`,
      to: passenger.email,
      subject: "Your Ride Booking is Confirmed!",
      html: `
        <h2>Booking Confirmed</h2>
        <p>Hi ${passenger.name},</p>
        <p>Your booking for the following ride has been confirmed by ${
          driver.name
        }:</p>
        <ul>
          <li><strong>From:</strong> ${ride.pickupLocation}</li>
          <li><strong>To:</strong> ${ride.dropoffLocation}</li>
          <li><strong>Date:</strong> ${new Date(
            ride.departureTime
          ).toLocaleString()}</li>
        </ul>
        <p>Contact your driver at: ${driver.phone}</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending booking confirmation to passenger:", error);
  }
};

exports.sendBookingRejectionToPassenger = async (passenger, driver, ride) => {
  try {
    const mailOptions = {
      from: `"Carpool App" <${config.email.user}>`,
      to: passenger.email,
      subject: "Your Ride Booking was Rejected",
      html: `
        <h2>Booking Rejected</h2>
        <p>Hi ${passenger.name},</p>
        <p>Your booking for the following ride was rejected by ${
          driver.name
        }:</p>
        <ul>
          <li><strong>From:</strong> ${ride.pickupLocation}</li>
          <li><strong>To:</strong> ${ride.dropoffLocation}</li>
          <li><strong>Date:</strong> ${new Date(
            ride.departureTime
          ).toLocaleString()}</li>
        </ul>
        <p>You can try booking another ride in the app.</p>
      `,
    };
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending booking rejection to passenger:", error);
  }
};
