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
      // Add these keys to all languages:
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
    },
    pagination: {
      page: "Page",
      of: "of",
      previous: "Previous",
      next: "Next",
    },
  },
  es: {
    translation: {
      // Auth
      login: "Iniciar Sesión",
      register: "Registrarse",
      email: "Correo Electrónico",
      password: "Contraseña",
      name: "Nombre",
      phone: "Número de Teléfono",
      signin: "Iniciar Sesión",
      signup: "Registrarse",
      logout: "Cerrar Sesión",

      // Navigation
      dashboard: "Panel",
      profile: "Perfil",
      findRide: "Buscar Viaje",
      offerRide: "Ofrecer Viaje",
      myRides: "Mis Viajes",

      // Dashboard
      welcome: "Bienvenido",
      toggleDriver: "Cambiar a Modo Conductor",
      toggleRider: "Cambiar a Modo Pasajero",
      currentMode: "Modo Actual",
      driver: "Conductor",
      rider: "Pasajero",

      // Common
      save: "Guardar",
      cancel: "Cancelar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",

      // New Keys
      driverModeRequired: "Se requiere modo conductor",
      switchToDriverModeMessage:
        "Debes cambiar al modo conductor para ofrecer viajes",
      goToProfile: "Ir al Perfil",
      driverModeEnabled: "Estás en modo conductor",
      riderModeEnabled: "Estás en modo pasajero",
      // Add these keys to all languages:
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
    },
    pagination: {
      page: "Página",
      of: "de",
      previous: "Anterior",
      next: "Siguiente",
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
