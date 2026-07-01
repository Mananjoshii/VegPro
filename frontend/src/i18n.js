import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Global / Layout
      "vegpro": "VegPro",
      "attendanceManagement": "Attendance Management",
      "logout": "Logout",
      "allRightsReserved": "All rights reserved.",
      "pleaseWait": "Please wait...",
      "add": "Add",
      "edit": "Edit",
      "delete": "Delete",
      "save": "Save",
      "cancel": "Cancel",
      "clear": "Clear",
      "update": "Update",

      // LoginPage
      "mobileNumber": "Mobile Number",
      "mobilePlaceholder": "Enter your 10-digit number",
      "password": "Password",
      "passwordPlaceholder": "Enter your password",
      "continue": "Continue",
      "login": "Login",
      "validMobileError": "Please enter a valid 10-digit mobile number.",
      "invalidCredentials": "Something went wrong.",

      // StaffDashboard
      "goodMorning": "Good Morning",
      "goodAfternoon": "Good Afternoon",
      "goodEvening": "Good Evening",
      "markAttendance": "MARK ATTENDANCE",
      "attendanceMarked": "Attendance Marked",
      "checkInTime": "Check-in Time",
      "attendanceSuccess": "Attendance marked successfully!",
      "alreadyMarked": "Attendance already marked today.",
      "markFailed": "Failed to mark attendance. Please try again.",

      // AdminDashboard
      "totalStaff": "Total Staff",
      "present": "Present",
      "absent": "Absent",
      "manageStaff": "Manage Staff",
      "manageAdmins": "Manage Admins",
      "attendanceHistory": "Attendance History",
      "todaysAttendance": "Today's Attendance",
      "noAttendanceYet": "No attendance yet today",

      // Management Pages
      "staff": "Staff",
      "admins": "Admins",
      "addStaff": "Add Staff",
      "editStaff": "Edit Staff",
      "addAdmin": "Add Admin",
      "editAdmin": "Edit Admin",
      "noStaff": "No staff added yet",
      "addFirstStaff": "Add First Staff Member",
      "noAdmins": "No admins found",
      "deleteConfirm": "Delete {{name}}? This will also delete their attendance records.",
      "deleteAdminConfirm": "Delete admin {{name}}?",
      
      // Forms
      "name": "Name",
      "namePlaceholder": "Enter full name",
      "newPasswordHint": "New Password (leave blank to keep)",
      "leaveBlankHint": "Leave blank to keep current",
      "nameRequired": "Name is required.",
      "mobileRequired": "Mobile number is required.",
      "passwordRequired": "Password is required.",
      "passwordMinLength": "Minimum 4 characters.",

      // Attendance History
      "selectStaffHint": "Select a staff member to view their attendance history:",
      "noStaffFound": "No staff members found",
      "filterByDate": "Filter by Date",
      "from": "From",
      "to": "To",
      "applyFilter": "Apply Filter",
      "noRecords": "No attendance records found",
      "checkIn": "Check-in",
      "days": "Days"
    }
  },
  hi: {
    translation: {
      // Global / Layout
      "vegpro": "वेजप्रो (VegPro)",
      "attendanceManagement": "उपस्थिति प्रबंधन (Attendance Management)",
      "logout": "लॉग आउट (Logout)",
      "allRightsReserved": "सर्वाधिकार सुरक्षित।",
      "pleaseWait": "कृपया प्रतीक्षा करें...",
      "add": "जोड़ें",
      "edit": "संपादित करें",
      "delete": "हटाएं",
      "save": "सहेजें",
      "cancel": "रद्द करें",
      "clear": "साफ़ करें",
      "update": "अपडेट करें",

      // LoginPage
      "mobileNumber": "मोबाइल नंबर",
      "mobilePlaceholder": "अपना 10-अंकों का नंबर दर्ज करें",
      "password": "पासवर्ड",
      "passwordPlaceholder": "अपना पासवर्ड दर्ज करें",
      "continue": "आगे बढ़ें",
      "login": "लॉग इन करें",
      "validMobileError": "कृपया सही 10-अंकों का मोबाइल नंबर दर्ज करें।",
      "invalidCredentials": "कुछ गलत हो गया।",

      // StaffDashboard
      "goodMorning": "शुभ प्रभात",
      "goodAfternoon": "शुभ दोपहर",
      "goodEvening": "शुभ संध्या",
      "markAttendance": "उपस्थिति दर्ज करें",
      "attendanceMarked": "उपस्थिति दर्ज हो गई",
      "checkInTime": "आने का समय",
      "attendanceSuccess": "उपस्थिति सफलतापूर्वक दर्ज की गई!",
      "alreadyMarked": "आज की उपस्थिति पहले ही दर्ज की जा चुकी है।",
      "markFailed": "उपस्थिति दर्ज करने में विफल। कृपया पुनः प्रयास करें।",

      // AdminDashboard
      "totalStaff": "कुल कर्मचारी",
      "present": "उपस्थित",
      "absent": "अनुपस्थित",
      "manageStaff": "कर्मचारी प्रबंधन",
      "manageAdmins": "एडमिन प्रबंधन",
      "attendanceHistory": "उपस्थिति का इतिहास",
      "todaysAttendance": "आज की उपस्थिति",
      "noAttendanceYet": "आज अभी तक कोई उपस्थिति नहीं",

      // Management Pages
      "staff": "कर्मचारी",
      "admins": "एडमिन",
      "addStaff": "कर्मचारी जोड़ें",
      "editStaff": "कर्मचारी संपादित करें",
      "addAdmin": "एडमिन जोड़ें",
      "editAdmin": "एडमिन संपादित करें",
      "noStaff": "अभी तक कोई कर्मचारी नहीं जोड़ा गया",
      "addFirstStaff": "पहला कर्मचारी जोड़ें",
      "noAdmins": "कोई एडमिन नहीं मिला",
      "deleteConfirm": "क्या आप {{name}} को हटाना चाहते हैं? इससे उनका उपस्थिति रिकॉर्ड भी हट जाएगा।",
      "deleteAdminConfirm": "क्या आप एडमिन {{name}} को हटाना चाहते हैं?",
      
      // Forms
      "name": "नाम",
      "namePlaceholder": "पूरा नाम दर्ज करें",
      "newPasswordHint": "नया पासवर्ड (बदलना न हो तो खाली छोड़ दें)",
      "leaveBlankHint": "वर्तमान पासवर्ड रखने के लिए खाली छोड़ दें",
      "nameRequired": "नाम आवश्यक है।",
      "mobileRequired": "मोबाइल नंबर आवश्यक है।",
      "passwordRequired": "पासवर्ड आवश्यक है।",
      "passwordMinLength": "कम से कम 4 अक्षर आवश्यक हैं।",

      // Attendance History
      "selectStaffHint": "उपस्थिति इतिहास देखने के लिए एक कर्मचारी चुनें:",
      "noStaffFound": "कोई कर्मचारी नहीं मिला",
      "filterByDate": "तारीख से फ़िल्टर करें",
      "from": "से",
      "to": "तक",
      "applyFilter": "फ़िल्टर लागू करें",
      "noRecords": "कोई उपस्थिति रिकॉर्ड नहीं मिला",
      "checkIn": "आगमन (Check-in)",
      "days": "दिन"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("vegpro_lang") || "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
