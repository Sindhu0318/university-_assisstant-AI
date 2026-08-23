export type LanguageCode = "en" | "te" | "hi";

export interface TranslationDict {
  appName: string;
  tagline: string;
  chat: string;
  assessments: string;
  notices: string;
  calendar: string;
  scholarships: string;
  fees: string;
  placements: string;
  documents: string;
  admin: string;
  history: string;
  login: string;
  logout: string;
  askPlaceholder: string;
  send: string;
  listening: string;
  thinking: string;
  sources: string;
  suggestedQuestions: string;
  newChat: string;
  helpful: string;
  notHelpful: string;
  clearChat: string;
  uploadFile: string;
  language: string;
  student: string;
  faculty: string;
  administrator: string;
  role: string;
  upcomingAssessments: string;
  latestNotices: string;
  academicCalendar: string;
  scholarshipFinder: string;
  feeStructure: string;
  placementHub: string;
  knowledgeBase: string;

  // Dashboards
  studentDashboard: string;
  facultyDashboard: string;
  adminDashboard: string;
  dashboards: string;
  selectDashboard: string;

  // Student Dashboard Specifics
  attendanceTracker: string;
  classesAttended: string;
  classesConducted: string;
  attendancePercentage: string;
  attendanceStatus: string;
  safeAttendance: string;
  condonationBand: string;
  detainedAttendance: string;
  myAssessments: string;
  myFees: string;
  myScholarships: string;

  // Faculty Dashboard Specifics
  courseOversight: string;
  uploadSyllabus: string;
  moduleManagement: string;
  studentBatchStatus: string;
  postFacultyCircular: string;

  // Notices additions
  addNotice: string;
  noticeTitle: string;
  noticeCategory: string;
  noticePriority: string;
  noticeDesc: string;
  noticeDept: string;
  publishNotice: string;
  cancel: string;
  searchNotices: string;
  allCategories: string;
  allPriorities: string;
  urgent: string;
  high: string;
  normal: string;

  // Common Table & UI
  module: string;
  presentation: string;
  type: string;
  dueDay: string;
  weightage: string;
  actions: string;
  viewAll: string;
  search: string;
  status: string;
  filter: string;
  category: string;
  department: string;
}

export const translations: Record<LanguageCode, TranslationDict> = {
  en: {
    appName: "UniAssist AI",
    tagline: "Multilingual Grounded Intelligence & Academic Knowledge Base",
    chat: "AI Assistant",
    assessments: "Assessments",
    notices: "Notices",
    calendar: "Calendar",
    scholarships: "Scholarships",
    fees: "Fee Structure",
    placements: "Placements",
    documents: "Knowledge Base",
    admin: "Admin Console",
    history: "Chat History",
    login: "Sign In",
    logout: "Sign Out",
    askPlaceholder: "Ask about regulations, 75% attendance, fees, assessments, scholarships...",
    send: "Send",
    listening: "Listening... Speak now",
    thinking: "Retrieving verified university context...",
    sources: "Official Sources & Citations",
    suggestedQuestions: "Suggested Topics",
    newChat: "New Conversation",
    helpful: "Helpful",
    notHelpful: "Not Helpful",
    clearChat: "Clear Chat",
    uploadFile: "Upload Document / Image",
    language: "Language",
    student: "Student",
    faculty: "Faculty",
    administrator: "Administrator",
    role: "Current Role",
    upcomingAssessments: "Upcoming Assessments & Due Dates",
    latestNotices: "Official University Circulars",
    academicCalendar: "Academic Calendar & Schedules",
    scholarshipFinder: "Scholarship Matcher & Eligibility",
    feeStructure: "Annual Fee Schedule & Refunds",
    placementHub: "Campus Placement Drives & Training",
    knowledgeBase: "University Policy Handbooks",

    studentDashboard: "Student Dashboard",
    facultyDashboard: "Faculty Dashboard",
    adminDashboard: "Admin Dashboard",
    dashboards: "Dashboards",
    selectDashboard: "Select Dashboard",

    attendanceTracker: "75% Attendance Policy Tracker",
    classesAttended: "Attended Lectures",
    classesConducted: "Total Scheduled",
    attendancePercentage: "Attendance Percentage",
    attendanceStatus: "Exam Eligibility Status",
    safeAttendance: "Eligible for Examinations (>= 75%)",
    condonationBand: "Requires Medical Condonation (65% - 74.9%)",
    detainedAttendance: "Strictly Detained (< 65%)",
    myAssessments: "My Registered Module Assessments",
    myFees: "Tuition & Hostel Fee Status",
    myScholarships: "Applied Scholarships Status",

    courseOversight: "Active Modules & Course Oversight",
    uploadSyllabus: "Upload Course Syllabus / Study Material",
    moduleManagement: "Module Assessment Weightages (AAA - GGG)",
    studentBatchStatus: "Batch Performance & Attendance Stats",
    postFacultyCircular: "Post Department Circular",

    addNotice: "Add New Notice",
    noticeTitle: "Notice Title",
    noticeCategory: "Category",
    noticePriority: "Priority Level",
    noticeDesc: "Notice Description / Details",
    noticeDept: "Issuing Department",
    publishNotice: "Publish Notice",
    cancel: "Cancel",
    searchNotices: "Search notices, circulars, departments...",
    allCategories: "All Categories",
    allPriorities: "All Priorities",
    urgent: "Urgent",
    high: "High",
    normal: "Normal",

    module: "Module",
    presentation: "Presentation",
    type: "Type",
    dueDay: "Due Day / Date",
    weightage: "Weightage (%)",
    actions: "Actions",
    viewAll: "View All",
    search: "Search...",
    status: "Status",
    filter: "Filter",
    category: "Category",
    department: "Department",
  },
  te: {
    appName: "యూనివర్సిటీ AI అసిస్టెంట్",
    tagline: "బహుభాషా విశ్వవిద్యాలయ అధికారిక సమాచార వ్యవస్థ",
    chat: "AI అసిస్టెంట్",
    assessments: "ఎసెస్మెంట్లు",
    notices: "నోటీసులు",
    calendar: "క్యాలెండర్",
    scholarships: "స్కాలర్‌షిప్‌లు",
    fees: "ఫీజుల వివరాలు",
    placements: "ప్లేస్‌మెంట్లు",
    documents: "నిబంధనావళి",
    admin: "అడ్మిన్ డ్యాష్‌బోర్డ్",
    history: "చాట్ హిస్టరీ",
    login: "లాగిన్",
    logout: "లాగౌట్",
    askPlaceholder: "హాజరు నిబంధనలు (75%), ఫీజులు, ఎసెస్మెంట్లు, స్కాలర్‌షిప్‌ల గురించి అడగండి...",
    send: "పంపండి",
    listening: "వింటోంది... మాట్లాడండి",
    thinking: "విశ్వవిద్యాలయ సమాచారాన్ని పరిశీలిస్తోంది...",
    sources: "అధికారిక ఆధారాలు & డాక్యుమెంట్లు",
    suggestedQuestions: "సూచించబడిన ప్రశ్నలు",
    newChat: "కొత్త చాట్ ప్రారంభించు",
    helpful: "ఉపయోగపడింది",
    notHelpful: "ఉపయోగపడలేదు",
    clearChat: "చాట్ తొలగించు",
    uploadFile: "డాక్యుమెంట్ అప్‌లోడ్",
    language: "భాష",
    student: "విద్యార్థి",
    faculty: "బోధనా సిబ్బంది",
    administrator: "అడ్మినిస్ట్రేటర్",
    role: "హోదా",
    upcomingAssessments: "రాబోయే పరీక్షలు & అసైన్‌మెంట్లు",
    latestNotices: "యూనివర్సిటీ సర్క్యులర్లు",
    academicCalendar: "అకడమిక్ క్యాలెండర్",
    scholarshipFinder: "స్కాలర్‌షిప్ అర్హత పరిశీలన",
    feeStructure: "ఫీజులు & రీఫండ్ నిబంధనలు",
    placementHub: "క్యాంపస్ ఇంటర్వ్యూలు & శిక్షణ",
    knowledgeBase: "విశ్వవిద్యాలయ నిబంధనలు",

    studentDashboard: "విద్యార్థి డ్యాష్‌బోర్డ్ (Student)",
    facultyDashboard: "ఫ్యాకల్టీ డ్యాష్‌బోర్డ్ (Faculty)",
    adminDashboard: "అడ్మిన్ డ్యాష్‌బోర్డ్ (Admin)",
    dashboards: "డ్యాష్‌బోర్డులు",
    selectDashboard: "డ్యాష్‌బోర్డ్ ఎంచుకోండి",

    attendanceTracker: "75% హాజరు నిబంధన పరిశీలన (Attendance Tracker)",
    classesAttended: "హాజరైన తరగతులు",
    classesConducted: "మొత్తం జరిగిన తరగతులు",
    attendancePercentage: "హాజరు శాతం",
    attendanceStatus: "పరీక్షల అర్హత స్థితి",
    safeAttendance: "పరీక్షలకు అర్హత ఉంది (>= 75%)",
    condonationBand: "మెడికల్ కండోనేషన్ అవసరం (65% - 74.9%)",
    detainedAttendance: "డిటెన్షన్ - పరీక్షలకు అనర్హులు (< 65%)",
    myAssessments: "నా రిజిస్టర్డ్ మాడ్యూల్ అసైన్‌మెంట్లు",
    myFees: "ట్యూషన్ & హాస్టల్ ఫీజు వివరాలు",
    myScholarships: "దరఖాస్తు చేసిన స్కాలర్‌షిప్‌లు",

    courseOversight: "యాక్టివ్ మాడ్యూల్స్ & కోర్సుల పర్యవేక్షణ",
    uploadSyllabus: "స్టడీ మెటీరియల్ / సిలబస్ అప్‌లోడ్ చేయండి",
    moduleManagement: "మాడ్యూల్ మార్కుల వెయిటేజ్ (AAA - GGG)",
    studentBatchStatus: "స్టూడెంట్ బ్యాచ్ హాజరు & ఫలితాల నివేదిక",
    postFacultyCircular: "విభాగపు నోటీసు జారీ చేయండి",

    addNotice: "+ కొత్త నోటీసు జోడించండి",
    noticeTitle: "నోటీసు శీర్షిక (Title)",
    noticeCategory: "విభాగం (Category)",
    noticePriority: "ప్రాధాన్యత (Priority)",
    noticeDesc: "నోటీసు పూర్తి వివరాలు (Description)",
    noticeDept: "జారీ చేసిన శాఖ (Department)",
    publishNotice: "నోటీసు ప్రచురించండి",
    cancel: "రద్దు చేయండి",
    searchNotices: "నోటీసులు, సర్క్యులర్లను శోధించండి...",
    allCategories: "అన్ని విభాగాలు",
    allPriorities: "అన్ని ప్రాధాన్యతలు",
    urgent: "అత్యవసరం (Urgent)",
    high: "ముఖ్యమైనది (High)",
    normal: "సాధారణం (Normal)",

    module: "మాడ్యూల్",
    presentation: "సెమిస్టర్ ప్రెజెంటేషన్",
    type: "రకం",
    dueDay: "గడువు తేదీ / రోజు",
    weightage: "వెయిటేజ్ (%)",
    actions: "చర్యలు",
    viewAll: "అన్నీ చూడండి",
    search: "శోధించండి...",
    status: "స్థితి",
    filter: "ఫిల్టర్",
    category: "వర్గం",
    department: "శాఖ",
  },
  hi: {
    appName: "विश्वविद्यालय AI सहायक",
    tagline: "बहुभाषी विश्वविद्यालय ज्ञानकोष एवं सूचना प्रणाली",
    chat: "AI सहायक",
    assessments: "मूल्यांकन (Assessments)",
    notices: "सूचनाएं (Notices)",
    calendar: "शैक्षणिक कैलेंडर",
    scholarships: "छात्रवृत्तियां",
    fees: "शुल्क संरचना",
    placements: "प्लेसमेंट",
    documents: "नियम पुस्तिका",
    admin: "व्यवस्थापक (Admin)",
    history: "बातचीत इतिहास",
    login: "लॉग इन",
    logout: "लॉग आउट",
    askPlaceholder: "उपस्थिति नियम (75%), फीस, परीक्षा, छात्रवृत्ति के बारे में पूछें...",
    send: "भेजें",
    listening: "सुन रहा हूँ... बोलिए",
    thinking: "सत्यापित विश्वविद्यालय संदर्भ खोजा जा रहा है...",
    sources: "आधिकारिक स्रोत एवं संदर्भ",
    suggestedQuestions: "सुझाए गए प्रश्न",
    newChat: "नई बातचीत",
    helpful: "उपयोगी",
    notHelpful: "अनुपयोगी",
    clearChat: "चैट साफ़ करें",
    uploadFile: "दस्तावेज़ अपलोड",
    language: "भाषा",
    student: "छात्र",
    faculty: "प्राध्यापक",
    administrator: "प्रशासक",
    role: "भूमिका",
    upcomingAssessments: "आगामी मूल्यांकन व अंतिम तिथियां",
    latestNotices: "आधिकारिक विश्वविद्यालय परिपत्र",
    academicCalendar: "शैक्षणिक कैलेंडर व अवकाश",
    scholarshipFinder: "छात्रवृत्ति पात्रता गाइड",
    feeStructure: "वार्षिक शुल्क एवं वापसी नीति",
    placementHub: "कैंपस प्लेसमेंट ड्राइव व प्रशिक्षण",
    knowledgeBase: "विश्वविद्यालय नियमावली",

    studentDashboard: "छात्र डैशबोर्ड (Student)",
    facultyDashboard: "संकाय डैशबोर्ड (Faculty)",
    adminDashboard: "व्यवस्थापक डैशबोर्ड (Admin)",
    dashboards: "डैशबोर्ड्स",
    selectDashboard: "डैशबोर्ड चुनें",

    attendanceTracker: "75% उपस्थिति नियम ट्रैकर",
    classesAttended: "उपस्थित व्याख्यान",
    classesConducted: "कुल कक्षाएं",
    attendancePercentage: "उपस्थिति प्रतिशत",
    attendanceStatus: "परीक्षा पात्रता स्थिति",
    safeAttendance: "परीक्षा के लिए पात्र (>= 75%)",
    condonationBand: "चिकित्सा छूट आवश्यक (65% - 74.9%)",
    detainedAttendance: "सख्ती से रोका गया (< 65%)",
    myAssessments: "पंजीकृत मॉड्यूल मूल्यांकन",
    myFees: "शिक्षण एवं छात्रावास शुल्क स्थिति",
    myScholarships: "छात्रवृत्ति आवेदन स्थिति",

    courseOversight: "सक्रिय मॉड्यूल एवं पाठ्यक्रम समीक्षा",
    uploadSyllabus: "अध्ययन सामग्री / पाठ्यक्रम अपलोड करें",
    moduleManagement: "मॉड्यूल मूल्यांकन वेटेज (AAA - GGG)",
    studentBatchStatus: "छात्र उपस्थिति एवं प्रदर्शन रिपोर्ट",
    postFacultyCircular: "विभागीय परिपत्र जारी करें",

    addNotice: "+ नई सूचना जोड़ें",
    noticeTitle: "सूचना शीर्षक (Title)",
    noticeCategory: "श्रेणी (Category)",
    noticePriority: "प्राथमिकता (Priority)",
    noticeDesc: "सूचना विवरण (Description)",
    noticeDept: "जारी करने वाला विभाग",
    publishNotice: "सूचना प्रकाशित करें",
    cancel: "रद्द करें",
    searchNotices: "सूचनाएं व परिपत्र खोजें...",
    allCategories: "सभी श्रेणियां",
    allPriorities: "सभी प्राथमिकताएं",
    urgent: "अति आवश्यक (Urgent)",
    high: "उच्च (High)",
    normal: "सामान्य (Normal)",

    module: "मॉड्यूल",
    presentation: "प्रस्तुति सत्र",
    type: "प्रकार",
    dueDay: "नियत तिथि / दिवस",
    weightage: "वेटेज (%)",
    actions: "कार्यवाही",
    viewAll: "सभी देखें",
    search: "खोजें...",
    status: "स्थिति",
    filter: "फ़िल्टर",
    category: "श्रेणी",
    department: "विभाग",
  },
};
