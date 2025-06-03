import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Auth
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      name: "Name",
      phone: "Phone Number",
      signin: "Sign In",
      signup: "Sign Up",
      logout: "Logout",

      // Navigation
      dashboard: "Dashboard",
      profile: "Profile",
      findRide: "Find Ride",
      offerRide: "Offer Ride",
      myRides: "My Rides",

      // Dashboard
      welcome: "Welcome",
      toggleDriver: "Switch to Driver Mode",
      toggleRider: "Switch to Rider Mode",
      currentMode: "Current Mode",
      driver: "Driver",
      rider: "Rider",

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
      ridesAsRider: "Rides as Rider",
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
      riderModeEnabled: "You are in rider mode",
      youAreInDriverMode: "You are in driver mode and can offer rides",
      youAreInRiderMode: "You are in rider mode and can book rides",
      currentMode: "Current Mode",
      driver: "Driver",
      rider: "Rider",
      switchToDriverMode: "Switch to Driver Mode",
      switchToRiderMode: "Switch to Rider Mode",
      quickActions: "Quick Actions",
      findRide: "Find Ride",
      offerRide: "Offer Ride",
      recentActivity: "Recent Activity",
      noRecentActivity: "No recent activity",
      switching: "Switching",
      toggleFailed: "Failed to switch mode",
      goToFindRide: "Go to Find Ride",
      goToOfferRide: "Go to Offer Ride",

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
      dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      profile: "ಪ್ರೊಫೈಲ್",
      findRide: "ರೈಡ್ ಹುಡುಕಿ",
      offerRide: "ರೈಡ್ ನೀಡಿ",
      myRides: "ನನ್ನ ರೈಡ್‌ಗಳು",

      // Dashboard
      welcome: "ಸ್ವಾಗತ",
      toggleDriver: "ಡ್ರೈವರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      toggleRider: "ರೈಡರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      currentMode: "ಪ್ರಸ್ತುತ ಮೋಡ್",
      driver: "ಡ್ರೈವರ್",
      rider: "ರೈಡರ್",

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
      ridesAsRider: "ರೈಡರ್ ಆಗಿ ರೈಡ್‌ಗಳು",
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
      riderModeEnabled: "ನೀವು ರೈಡರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ",
      youAreInDriverMode:
        "ನೀವು ಡ್ರೈವರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ ಮತ್ತು ರೈಡ್‌ಗಳನ್ನು ನೀಡಬಹುದು",
      youAreInRiderMode:
        "ನೀವು ರೈಡರ್ ಮೋಡ್‌ನಲ್ಲಿದ್ದೀರಿ ಮತ್ತು ರೈಡ್‌ಗಳನ್ನು ಬುಕ್ ಮಾಡಬಹುದು",
      currentMode: "ಪ್ರಸ್ತುತ ಮೋಡ್",
      driver: "ಡ್ರೈವರ್",
      rider: "ರೈಡರ್",
      switchToDriverMode: "ಡ್ರೈವರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      switchToRiderMode: "ರೈಡರ್ ಮೋಡ್‌ಗೆ ಬದಲಾಯಿಸಿ",
      quickActions: "ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
      findRide: "ರೈಡ್ ಹುಡುಕಿ",
      offerRide: "ರೈಡ್ ನೀಡಿ",
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
    },
    pagination: {
      page: "ಪುಟ",
      of: "ರಲ್ಲಿ",
      previous: "ಹಿಂದಿನ",
      next: "ಮುಂದಿನ",
    },
  },
  hi: {
    translation: {
      // Auth
      login: "लॉग इन",
      register: "रजिस्टर",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      phone: "फोन नंबर",
      signin: "साइन इन",
      signup: "साइन अप",
      logout: "लॉग आउट",

      // Navigation
      dashboard: "डैशबोर्ड",
      profile: "प्रोफ़ाइल",
      findRide: "राइड खोजें",
      offerRide: "राइड ऑफर करें",
      myRides: "मेरी राइड्स",

      // Dashboard
      welcome: "स्वागत",
      toggleDriver: "ड्राइवर मोड में बदलें",
      toggleRider: "राइडर मोड में बदलें",
      currentMode: "वर्तमान मोड",
      driver: "ड्राइवर",
      rider: "राइडर",

      // Find Ride
      searchRides: "राइड्स खोजें",
      pickupLocation: "पिकअप स्थान",
      dropoffLocation: "ड्रॉपऑफ स्थान",
      departureDate: "प्रस्थान तिथि",
      maxPrice: "अधिकतम कीमत",
      minSeats: "न्यूनतम सीटें",
      searchWithAI: "AI के साथ खोजें",
      aiPlaceholder:
        "जैसे, मुझे सुबह 9 बजे MG Road से Indiranagar तक राइड चाहिए",
      bookRide: "राइड बुक करें",
      seatsAvailable: "सीटें उपलब्ध",

      // Offer Ride
      createRide: "नई राइड बनाएं",
      departureTime: "प्रस्थान समय",
      arrivalTime: "आगमन समय",
      pricePerSeat: "प्रति सीट कीमत",
      totalSeats: "कुल सीटें",
      offerRideBtn: "राइड ऑफर करें",

      // My Rides
      ridesAsDriver: "ड्राइवर के रूप में राइड्स",
      ridesAsRider: "राइडर के रूप में राइड्स",
      noRides: "कोई राइड्स नहीं मिलीं",
      completeRide: "पूर्ण के रूप में चिह्नित करें",

      // Common
      save: "सेव करें",
      cancel: "रद्द करें",
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफलता",

      // New Keys
      driverModeRequired: "ड्राइवर मोड आवश्यक है",
      switchToDriverModeMessage:
        "राइड ऑफर करने के लिए आपको ड्राइवर मोड में स्विच करना होगा",
      goToProfile: "प्रोफ़ाइल पर जाएं",
      driverModeEnabled: "आप ड्राइवर मोड में हैं",
      riderModeEnabled: "आप राइडर मोड में हैं",
      youAreInDriverMode: "आप ड्राइवर मोड में हैं और राइड ऑफर कर सकते हैं",
      youAreInRiderMode: "आप राइडर मोड में हैं और राइड बुक कर सकते हैं",
      currentMode: "वर्तमान मोड",
      driver: "ड्राइवर",
      rider: "राइडर",
      switchToDriverMode: "ड्राइवर मोड पर स्विच करें",
      switchToRiderMode: "राइडर मोड पर स्विच करें",
      quickActions: "त्वरित क्रियाएं",
      findRide: "राइड खोजें",
      offerRide: "राइड ऑफर करें",
      recentActivity: "हाल की गतिविधि",
      noRecentActivity: "कोई हाल की गतिविधि नहीं है",
      switching: "स्विच किया जा रहा है",
      toggleFailed: "मोड स्विच करने में विफल",
      goToFindRide: "राइड खोजने जाएं",
      goToOfferRide: "राइड ऑफर करने जाएं",

      // Profile
      profile: "प्रोफ़ाइल",
      name: "नाम",
      phone: "फोन",
      changePhoto: "फोटो बदलें",
      profilePhotoInstructions:
        "अपनी प्रोफ़ाइल के लिए एक स्पष्ट फोटो अपलोड करें।",
      maxFileSize: "अधिकतम फ़ाइल साइज़",
      profileUpdatedSuccessfully: "प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!",
      updateFailed: "प्रोफ़ाइल अपडेट विफल हुआ। कृपया फिर से प्रयास करें।",
      fileTooLarge: "फ़ाइल बहुत बड़ी है। अधिकतम साइज़ 2MB है।",
      invalidPhoneNumber: "कृपया एक मान्य 10-अंकीय फोन नंबर दर्ज करें।",
      saving: "सेव हो रहा है",
      saveChanges: "परिवर्तन सहेजें",
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
