import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Common
      loading: "Loading",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      confirm: "Confirm",
      delete: "Delete",
      edit: "Edit",
      search: "Search",
      previous: "Previous",
      next: "Next",
      page: "Page",
      of: "of",

      // Auth
      login: "Login",
      register: "Register",
      logout: "Logout",
      email: "Email",
      password: "Password",
      name: "Name",
      phone: "Phone",
      loginSuccess: "Login successful",
      registerSuccess: "Registration successful",
      logoutSuccess: "Logout successful",

      // Profile
      profile: "Profile",
      updateProfile: "Update Profile",
      driverMode: "Driver Mode",
      passengerMode: "Passenger Mode",
      switchToDriver: "Switch to Driver Mode",
      switchToPassenger: "Switch to Passenger Mode",
      carDetails: "Car Details",
      carModel: "Car Model",
      carPlate: "License Plate",
      licenseNumber: "License Number",
      carColor: "Car Color",
      carCapacity: "Car Capacity",
      profilePhoto: "Profile Photo",
      uploadPhoto: "Upload Photo",

      // Rides
      findRide: "Find a Ride",
      offerRide: "Offer a Ride",
      myRides: "My Rides",
      ridesAsDriver: "Rides as Driver",
      ridesAsPassenger: "Rides as Passenger",
      noRidesAsDriver: "You haven't offered any rides yet",
      noRidesAsPassenger: "You haven't booked any rides yet",
      pickupLocation: "Pickup Location",
      dropoffLocation: "Dropoff Location",
      departureTime: "Departure Time",
      arrivalTime: "Arrival Time",
      price: "Price",
      seatsAvailable: "Seats Available",
      bookRide: "Book Ride",
      completeRide: "Complete Ride",
      leaveReview: "Leave Review",
      driver: "Driver",
      passenger: "Passenger",
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
      inProgress: "In Progress",
      upcoming: "Upcoming",
      waitingForDriverConfirmation: "Waiting for driver confirmation",
      confirmBookingRequest: "Are you sure you want to confirm this booking?",
      bookingConfirmedSuccessfully: "Booking confirmed successfully",
      confirmationFailed: "Failed to confirm booking",
      confirmCompleteRide:
        "Are you sure you want to mark this ride as completed?",
      rideCompletedSuccessfully: "Ride completed successfully",
      completionFailed: "Failed to complete ride",

      // Reviews
      review: {
        title: "Review",
        rating: "Rating",
        comment: "Comment",
        submit: "Submit Review",
        success: "Review submitted successfully",
        failed: "Failed to submit review",
        reviewed: "Reviewed",
      },

      // Search
      searchWithAI: "Search with AI",
      aiPlaceholder: "Describe the ride you're looking for...",
      enterPickupLocation: "Enter pickup location",
      enterDropoffLocation: "Enter dropoff location",
      enterMaxPrice: "Enter maximum price",
      enterMinSeats: "Enter minimum seats",
      searchRides: "Search Rides",
      searching: "Searching",
      loadingRides: "Loading rides...",
      noRidesFound: "No rides found",
      seatsAvailable: "seats available",

      // Messages
      loadFailed: "Failed to load data",
      searchFailed: "Search failed",
      bookingFailed: "Booking failed",
      rideBookedSuccessfully: "Ride booked successfully",
      confirmBooking: "Are you sure you want to book this ride?",

      // Navigation
      home: "Home",
      dashboard: "Dashboard",
      profile: "Profile",
      findRide: "Find Ride",
      offerRide: "Offer Ride",
      myRides: "My Rides",

      // Dashboard
      welcome: "Welcome",
      toggleDriver: "Switch to Driver Mode",
      togglePassenger: "Switch to Passenger Mode",
      currentMode: "Current Mode",
      driver: "Driver",
      passenger: "Passenger",

      // Find Ride
      searchRides: "Search Rides",
      pickupLocation: "Pickup Location",
      dropoffLocation: "Dropoff Location",
      departureDate: "Departure Date",
      maxPrice: "Max Price",
      minSeats: "Min Seats",
      searchWithAI: "Search with AI",
      aiPlaceholder: "e.g., I need a ride from MG Road to Indiranagar at 9 AM",
      bookRide: "Book Ride",
      seatsAvailable: "seats available",

      // Offer Ride
      createRide: "Create New Ride",
      departureTime: "Departure Time",
      arrivalTime: "Arrival Time",
      pricePerSeat: "Price per Seat",
      totalSeats: "Total Seats",
      offerRideBtn: "Offer Ride",

      // My Rides
      ridesAsDriver: "Rides as Driver",
      ridesAsPassenger: "Rides as Passenger",
      noRides: "No rides found",
      completeRide: "Mark Complete",

      // Common
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      error: "Error",
      success: "Success",

      // New Keys
      driverModeRequired: "Driver Mode Required",
      switchToDriverModeMessage:
        "You need to switch to driver mode to offer rides",
      goToProfile: "Go to Profile",
      driverModeEnabled: "You are in driver mode",
      passengerModeEnabled: "You are in passenger mode",
      youAreInDriverMode: "You are in driver mode and can offer rides",
      youAreInPassengerMode: "You are in passenger mode and can book rides",
      currentMode: "Current Mode",
      driver: "Driver",
      passenger: "Passenger",
      switchToDriverMode: "Switch to Driver Mode",
      switchToPassengerMode: "Switch to Passenger Mode",
      quickActions: "Quick Actions",
      findRide: "Find Ride",
      offerRide: "Offer Ride",
      recentActivity: "Recent Activity",
      noRecentActivity: "No recent activity",
      switching: "Switching",
      toggleFailed: "Failed to switch mode",
      goToFindRide: "Go to Find Ride",
      goToOfferRide: "Go to Offer Ride",
      goToOfferRide: "Go to Offer Ride",
      changePhoto: "Change photo",
      profilePhotoInstructions: "Upload a clear photo for your profile.",
      maxFileSize: "Max file size",
      profileUpdatedSuccessfully: "Profile updated successfully!",
      updateFailed: "Profile update failed. Please try again.",
      fileTooLarge: "File is too large. Max size is 2MB.",
      invalidPhoneNumber: "Please enter a valid 10-digit phone number.",
      saving: "Saving",
      saveChanges: "Save Changes",

      // Profile
      profile: "Profile",
      name: "Name",
      phone: "Phone",
      changePhoto: "Change photo",
      profilePhotoInstructions: "Upload a clear photo for your profile.",
      maxFileSize: "Max file size",
      profileUpdatedSuccessfully: "Profile updated successfully!",
      updateFailed: "Profile update failed. Please try again.",
      fileTooLarge: "File is too large. Max size is 2MB.",
      invalidPhoneNumber: "Please enter a valid 10-digit phone number.",
      saving: "Saving",
      saveChanges: "Save Changes",
      tagline: "Share Rides, Save Costs, Travel Together",
      subtitle:
        "Connect with fellow travelers and make your commute affordable and enjoyable",
      findRideBtn: "Find a Ride",
      offerRideBtn: "Offer a Ride",
      howItWorks: "How It Works",
      findRide: "Find Your Ride",
      findRideDesc: "Search for rides going your way and book instantly",
      offerRide: "Offer a Ride",
      offerRideDesc:
        "Share your journey and save costs by traveling with others",
      saveMoney: "Save Money",
      saveMoneyDesc: "Split travel costs and reduce your commuting expenses",
      userTestimonials: "What Our Users Say",
      testimonial1:
        "This app saved me 60% on my daily commute costs. The drivers are always punctual!",
      testimonial2:
        "As a driver, I've met wonderful people and now my car costs are covered every month.",
      testimonial3:
        "The safest and most affordable way to travel between cities. Highly recommended!",
      user1: "Sarah M.",
      user2: "James K.",
      user3: "Priya T.",
      passenger: "Regular Passenger",
      driver: "Driver",
      getStarted: "Get Started Now",
      goToDashboard: "Go to Dashboard",
      review: {
        reviewed: "Feedback Submitted",
      },
      // Footer
      footer: {
        description: "Connecting people. Saving the planet.",
      },
      quickLinks: "Quick Links",
      support: "Support",
      helpCenter: "Help Center",
      contactUs: "Contact Us",
      faq: "FAQ",
      followUs: "Follow Us",
      allRightsReserved: "All rights reserved.",
    },
    pagination: {
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
    },
  },
  kn: {
    translation: {
      // Auth
      login: "ಲಾಗಿನ್",
      register: "ನೋಂದಣಿ",
      email: "ಇಮೇಲ್",
      password: "ಪಾಸ್‌ವರ್ಡ್",
      name: "ಹೆಸರು",
      phone: "ಫೋನ್ ಸಂಖ್ಯೆ",
      signin: "ಸೈನ್ ಇನ್",
      signup: "ಸೈನ್ ಅಪ್",
      logout: "ಲಾಗ್ಔಟ್",

      // Navigation
      home: "ಮುಖಪುಟ",
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      profile: "ಪ್ರೊಫೈಲ್",
      findRide: "ರೈಡ್ ಹುಡುಕಿ",
      offerRide: "ರೈಡ್ ನೀಡಿ",
      myRides: "ನನ್ನ ರೈಡ್‌ಗಳು",

      // Dashboard
      welcome: "ಸ್ವಾಗತ",
      toggleDriver: "ಡ್ರೈವರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      togglePassenger: "ಪ್ಯಾಸೆಂಜರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      currentMode: "ಪ್ರಸ್ತುತ ಮೋಡ್",
      driver: "ಡ್ರೈವರ್",
      passenger: "ಪ್ಯಾಸೆಂಜರ್",

      // Find Ride
      searchRides: "ರೈಡ್‌ಗಳನ್ನು ಹುಡುಕಿ",
      pickupLocation: "ಪಿಕ್‌ಅಪ್ ಸ್ಥಳ",
      dropoffLocation: "ಡ್ರಾಪ್‌ಆಫ್ ಸ್ಥಳ",
      departureDate: "ಹೊರಡುವ ದಿನಾಂಕ",
      maxPrice: "ಗರಿಷ್ಠ ಬೆಲೆ",
      minSeats: "ಕನಿಷ್ಠ ಸೀಟುಗಳು",
      searchWithAI: "AI ಯೊಂದಿಗೆ ಹುಡುಕಿ",
      aiPlaceholder:
        "ಉದಾ., ನನಗೆ ಬೆಳಿಗ್ಗೆ 9 ಗಂಟೆಗೆ MG Road ನಿಂದ Indiranagar ಗೆ ರೈಡ್ ಬೇಕು",
      bookRide: "ರೈಡ್ ಬುಕ್ ಮಾಡಿ",
      seatsAvailable: "ಸೀಟುಗಳು ಲಭ್ಯ",

      // Offer Ride
      createRide: "ಹೊಸ ರೈಡ್ ಸೃಷ್ಟಿಸಿ",
      departureTime: "ಹೊರಡುವ ಸಮಯ",
      arrivalTime: "ಆಗಮನ ಸಮಯ",
      pricePerSeat: "ಪ್ರತಿ ಸೀಟಿಗೆ ಬೆಲೆ",
      totalSeats: "ಒಟ್ಟು ಸೀಟುಗಳು",
      offerRideBtn: "ರೈಡ್ ನೀಡಿ",

      // My Rides
      ridesAsDriver: "ಡ್ರೈವರ್ ಆಗಿ ರೈಡ್‌ಗಳು",
      ridesAsPassenger: "ಪ್ಯಾಸೆಂಜರ್ ಆಗಿ ರೈಡ್‌ಗಳು",
      noRides: "ಯಾವುದೇ ರೈಡ್‌ಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
      completeRide: "ಪೂರ್ಣಗೊಳಿಸಿ ಎಂದು ಗುರುತಿಸಿ",

      // Common
      save: "ಉಳಿಸಿ",
      cancel: "ರದ್ದುಮಾಡಿ",
      loading: "ಲೋಡ್ ಆಗುತ್ತಿದೆ...",
      error: "ದೋಷ",
      success: "ಯಶಸ್ಸು",

      // New Keys
      driverModeRequired: "ಡ್ರೈವರ್ ಮೋಡ್ ಅಗತ್ಯವಿದೆ",
      switchToDriverModeMessage:
        "ರೈಡ್‌ಗಳನ್ನು ನೀಡಲು ನೀವು ಡ್ರೈವರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಬೇಕು",
      goToProfile: "ಪ್ರೊಫೈಲ್‌ಗೆ ಹೋಗಿ",
      driverModeEnabled: "ನೀವು ಡ್ರೈವರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ",
      passengerModeEnabled: "ನೀವು ಪ್ಯಾಸೆಂಜರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ",
      youAreInDriverMode:
        "ನೀವು ಡ್ರೈವರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ ಮತ್ತು ರೈಡ್‌ಗಳನ್ನು ನೀಡಬಹುದು",
      youAreInPassengerMode:
        "ನೀವು ಪ್ಯಾಸೆಂಜರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ ಮತ್ತು ರೈಡ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಬಹುದು",
      currentMode: "ಪ್ರಸ್ತುತ ಮೋಡ್",
      driver: "ಡ್ರೈವರ್",
      passenger: "ಪ್ಯಾಸೆಂಜರ್",
      switchToDriverMode: "ಡ್ರೈವರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      switchToPassengerMode: "ಪ್ಯಾಸೆಂಜರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      findRide: "ರೈಡ್ ಹುಡುಕಿ",
      offerRide: "ರೈಡ್ ನೀಡಿ",
      quickLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
      recentActivity: "ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ",
      noRecentActivity: "ಯಾವುದೇ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ ಇಲ್ಲ",
      switching: "ಬದಲಾಯಿಸುತ್ತಿದೆ",
      toggleFailed: "ಮೋಡ್ ಬದಲಾಯಿಸಲು ವಿಫಲವಾಗಿದೆ",
      goToFindRide: "ರೈಡ್ ಹುಡುಕಲು ಹೋಗಿ",
      goToOfferRide: "ರೈಡ್ ನೀಡಲು ಹೋಗಿ",

      // Profile
      profile: "ಪ್ರೊಫೈಲ್",
      name: "ಹೆಸರು",
      phone: "ಫೋನ್",
      changePhoto: "ಫೋಟೋ ಬದಲಾಯಿಸಿ",
      profilePhotoInstructions:
        "ನಿಮ್ಮ ಪ್ರೊಫೈಲ್‌ಗಾಗಿ ಸ್ಪಷ್ಟವಾದ ಫೋಟೋವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      maxFileSize: "ಗರಿಷ್ಠ ಫೈಲ್ ಗಾತ್ರ",
      profileUpdatedSuccessfully: "ಪ್ರೊಫೈಲ್ ಯಶಸ್ವಿಯಾಗಿ ಅಪ್‌ಡೇಟ್ ಆಗಿದೆ!",
      updateFailed: "ಪ್ರೊಫೈಲ್ ಅಪ್‌ಡೇಟ್ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
      fileTooLarge: "ಫೈಲ್ ತುಂಬಾ ದೊಡ್ಡದಾಗಿದೆ. ಗರಿಷ್ಠ ಗಾತ್ರ 2MB.",
      invalidPhoneNumber:
        "ದಯವಿಟ್ಟು ಮಾನ್ಯವಾದ 10-ಅಂಕಿಯ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
      saving: "ಉಳಿಸುತ್ತಿದೆ",
      saveChanges: "ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ",

      tagline: "ರೈಡ್‌ಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ, ವೆಚ್ಚಗಳನ್ನು ಉಳಿಸಿ, ಒಟ್ಟಿಗೆ ಪ್ರಯಾಣಿಸಿ",
      subtitle:
        "ಸಹ ಪ್ರಯಾಣಿಕರೊಂದಿಗೆ ಸಂಪರ್ಕ ಸಾಧಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಕೈಗೆಟುಕುವ ಮತ್ತು ಆನಂದದಾಯಕವಾಗಿಸಿ",
      findRideBtn: "ರೈಡ್ ಹುಡುಕಿ",
      offerRideBtn: "ರೈಡ್ ನೀಡಿ",
      howItWorks: "ಇದು ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
      findRide: "ನಿಮ್ಮ ರೈಡ್ ಹುಡುಕಿ",
      findRideDesc:
        "ನಿಮ್ಮ ದಾರಿಯಲ್ಲಿ ಹೋಗುವ ರೈಡ್‌ಗಳನ್ನು ಹುಡುಕಿ ಮತ್ತು ತಕ್ಷಣ ಬುಕ್ ಮಾಡಿ",
      offerRide: "ರೈಡ್ ನೀಡಿ",
      offerRideDesc:
        "ನಿಮ್ಮ ಪ್ರಯಾಣವನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಇತರರೊಂದಿಗೆ ಪ್ರಯಾಣಿಸುವ ಮೂಲಕ ವೆಚ್ಚಗಳನ್ನು ಉಳಿಸಿ",
      saveMoney: "ಹಣವನ್ನು ಉಳಿಸಿ",
      saveMoneyDesc:
        "ಪ್ರಯಾಣದ ವೆಚ್ಚಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ನಿಮ್ಮ ಪ್ರಯಾಣದ ಖರ್ಚುಗಳನ್ನು ಕಡಿಮೆ ಮಾಡಿ",
      userTestimonials: "ನಮ್ಮ ಬಳಕೆದಾರರು ಏನು ಹೇಳುತ್ತಾರೆ",
      testimonial1:
        "ಈ ಅಪ್ಲಿಕೇಶನ್ ನನ್ನ ದೈನಂದಿನ ಪ್ರಯಾಣದ ವೆಚ್ಚಗಳಲ್ಲಿ 60% ಉಳಿಸಿದೆ. ಚಾಲಕರು ಯಾವಾಗಲೂ ಸಮಯಕ್ಕೆ ಬರುತ್ತಾರೆ!",
      testimonial2:
        "ಡ್ರೈವರ್ ಆಗಿ, ನಾನು ಅದ್ಭುತ ಜನರನ್ನು ಭೇಟಿಯಾಗಿದ್ದೇನೆ ಮತ್ತು ಈಗ ನನ್ನ ಕಾರಿನ ವೆಚ್ಚಗಳು ಪ್ರತಿ ತಿಂಗಳು ಮುಚ್ಚಲ್ಪಟ್ಟಿವೆ.",
      testimonial3:
        "ನಗರಗಳ ನಡುವೆ ಪ್ರಯಾಣಿಸಲು ಅತ್ಯಂತ ಸುರಕ್ಷಿತ ಮತ್ತು ಕೈಗೆಟುಕುವ ಮಾರ್ಗ. ಹೆಚ್ಚು ಶಿಫಾರಸು ಮಾಡುತ್ತೇನೆ!",
      user1: "ಸಾರಾ ಎಂ.",
      user2: "ಜೇಮ್ಸ್ ಕೆ.",
      user3: "ಪ್ರಿಯಾ ಟಿ.",
      passenger: "ನಿಯಮಿತ ಪ್ರಯಾಣಿಕ",
      driver: "ಚಾಲಕ",
      getStarted: "ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ",
      goToDashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹೋಗಿ",
      footer: {
        description: "ಜನರನ್ನು ಸಂಪರ್ಕಿಸುತ್ತಿದೆ. ಗ್ರಹವನ್ನು ಉಳಿಸುತ್ತಿದೆ.",
      },
      // Footer
      quickLinks: "ತ್ವರಿತ ಲಿಂಕ್‌ಗಳು",
      support: "ಬೆಂಬಲ",
      helpCenter: "ಸಹಾಯ ಕೇಂದ್ರ",
      contactUs: "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
      faq: "ಪ್ರಶ್ನೆಗಳು",
      followUs: "ನಮ್ಮನ್ನು ಅನುಸರಿಸಿ",
      allRightsReserved: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
      home: "ಮುಖಪುಟ",
      pagination: {
        page: "ಪುಟ",
        of: "ರಲ್ಲಿ",
        previous: "ಹಿಂದಿನ",
        next: "ಮುಂದಿನ",
      },
    },
  },
  hi: {
    translation: {
      // Auth
      login: "लॉगिन",
      register: "पंजीकरण",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      phone: "फ़ोन नंबर",
      signin: "साइन इन",
      signup: "साइन अप",
      logout: "लॉगआउट",

      home: "मुखपृष्ठ",
      dashboard: "डैशबोर्ड",
      profile: "प्रोफ़ाइल",
      findRide: "सवारी खोजें",
      offerRide: "सवारी दें",
      myRides: "मेरी सवारियाँ",

      welcome: "स्वागत है",
      toggleDriver: "ड्राइवर मोड पर स्विच करें",
      togglePassenger: "पैसेंजर मोड पर स्विच करें",
      currentMode: "वर्तमान मोड",
      driver: "ड्राइवर",
      passenger: "पैसेंजर",

      searchRides: "सवारियाँ खोजें",
      pickupLocation: "पिकअप स्थान",
      dropoffLocation: "ड्रॉपऑफ स्थान",
      departureDate: "प्रस्थान तिथि",
      maxPrice: "अधिकतम मूल्य",
      minSeats: "न्यूनतम सीटें",
      searchWithAI: "AI से खोजें",
      aiPlaceholder: "जैसे, मुझे सुबह 9 बजे MG रोड से इंदिरानगर तक सवारी चाहिए",
      bookRide: "सवारी बुक करें",
      seatsAvailable: "सीटें उपलब्ध",

      createRide: "नई सवारी बनाएं",
      departureTime: "प्रस्थान समय",
      arrivalTime: "आगमन समय",
      pricePerSeat: "प्रति सीट कीमत",
      totalSeats: "कुल सीटें",
      offerRideBtn: "सवारी ऑफर करें",

      ridesAsDriver: "ड्राइवर के रूप में सवारियाँ",
      ridesAsPassenger: "पैसेंजर के रूप में सवारियाँ",
      noRides: "कोई सवारी नहीं मिली",
      completeRide: "पूर्ण करें",

      save: "सहेजें",
      cancel: "रद्द करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",

      driverModeRequired: "ड्राइवर मोड आवश्यक है",
      switchToDriverModeMessage:
        "सवारी देने के लिए कृपया ड्राइवर मोड पर स्विच करें",
      goToProfile: "प्रोफ़ाइल पर जाएँ",
      driverModeEnabled: "आप ड्राइवर मोड में हैं",
      passengerModeEnabled: "आप पैसेंजर मोड में हैं",
      youAreInDriverMode: "आप ड्राइवर मोड में हैं और सवारी ऑफर कर सकते हैं",
      youAreInPassengerMode: "आप पैसेंजर मोड में हैं और सवारी बुक कर सकते हैं",
      switchToDriverMode: "ड्राइवर मोड पर जाएँ",
      switchToPassengerMode: "पैसेंजर मोड पर जाएँ",
      quickActions: "त्वरित क्रियाएं",
      quickLinks: "त्वरित लिंक",
      recentActivity: "हाल की गतिविधि",
      noRecentActivity: "कोई हाल की गतिविधि नहीं है",
      switching: "स्विच हो रहा है",
      toggleFailed: "मोड बदलने में विफल",

      goToFindRide: "सवारी खोजने जाएँ",
      goToOfferRide: "सवारी देने जाएँ",

      changePhoto: "फोटो बदलें",
      profilePhotoInstructions:
        "अपने प्रोफ़ाइल के लिए एक स्पष्ट फोटो अपलोड करें।",
      maxFileSize: "अधिकतम फ़ाइल आकार",
      profileUpdatedSuccessfully: "प्रोफ़ाइल सफलतापूर्वक अपडेट की गई!",
      updateFailed: "प्रोफ़ाइल अपडेट विफल। कृपया पुनः प्रयास करें।",
      fileTooLarge: "फ़ाइल बहुत बड़ी है। अधिकतम आकार 2MB है।",
      invalidPhoneNumber: "कृपया एक मान्य 10-अंकों का फ़ोन नंबर दर्ज करें।",
      saving: "सहेजा जा रहा है",
      saveChanges: "परिवर्तन सहेजें",

      tagline: "सवारी साझा करें, खर्च बचाएँ, साथ यात्रा करें",
      subtitle:
        "सह-यात्रियों से जुड़ें और अपनी यात्रा को किफायती और आनंददायक बनाएं",
      findRideBtn: "सवारी खोजें",
      offerRideBtn: "सवारी ऑफर करें",
      howItWorks: "यह कैसे काम करता है",
      findRideDesc: "अपने मार्ग की सवारियाँ खोजें और तुरंत बुक करें",
      offerRideDesc:
        "अपनी यात्रा साझा करें और दूसरों के साथ यात्रा कर पैसे बचाएं",
      saveMoney: "पैसे बचाएं",
      saveMoneyDesc: "यात्रा लागत साझा करें और अपनी खर्चों को कम करें",
      userTestimonials: "हमारे उपयोगकर्ता क्या कहते हैं",
      testimonial1:
        "इस ऐप ने मेरी यात्रा लागतों में 60% की बचत की। ड्राइवर हमेशा समय पर आते हैं!",
      testimonial2:
        "ड्राइवर के रूप में, मुझे शानदार लोग मिले और अब मेरी कार की लागत हर महीने कवर हो जाती है।",
      testimonial3:
        "शहरों के बीच यात्रा के लिए सबसे सुरक्षित और किफायती तरीका। अत्यधिक अनुशंसित!",
      user1: "सारा एम.",
      user2: "जेम्स के.",
      user3: "प्रिया टी.",
      passenger: "नियमित यात्री",
      driver: "चालक",
      getStarted: "शुरू करें",
      goToDashboard: "डैशबोर्ड पर जाएं",

      footer: {
        description: "लोगों को जोड़ना। ग्रह को बचाना।",
      },
      support: "सहायता",
      helpCenter: "सहायता केंद्र",
      contactUs: "हमसे संपर्क करें",
      faq: "प्रश्नोत्तर",
      followUs: "हमें फॉलो करें",
      allRightsReserved: "सभी अधिकार सुरक्षित।",
    },
    pagination: {
      page: "पृष्ठ",
      of: "में से",
      previous: "पिछला",
      next: "अगला",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
