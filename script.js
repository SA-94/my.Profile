// تهيئة AOS
AOS.init();

// الإعدادات الافتراضية
const defaultSettings = {
  theme: document.documentElement.getAttribute("data-theme") || "light",
  headerBg: "linear-gradient(135deg, #2c3e50, #3498db)",
  portfolioLayout: "grid"
};

let isAuthenticated = false;
const correctPassword = "12345";

// عند تحميل الصفحة
window.addEventListener("load", () => {
  document.getElementById("preloader").style.display = "none";
  const year = new Date().getFullYear();
  document.getElementById("footerCopyright").innerText = `جميع الحقوق محفوظة © ${year}`;

  // ضبط شريط التقدم
  document.querySelectorAll(".progress-bar").forEach((bar) => {
    bar.style.width = bar.dataset.progress + "%";
  });

  restoreSettings();
});

// زر العودة للأعلى
window.addEventListener("scroll", () => {
  document.getElementById("backToTop").style.display = window.scrollY > 300 ? "block" : "none";
});
document.getElementById("backToTop").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// نظام تسجيل الدخول
function openLoginModal() {
  document.getElementById("loginModal").style.display = "flex";
  document.getElementById("passwordInput").focus();
}
function checkPassword() {
  if (document.getElementById("passwordInput").value === correctPassword) {
    isAuthenticated = true;
    document.getElementById("loginModal").style.display = "none";
    openEditPanel();
  } else {
    showError("كلمة المرور غير صحيحة!");
  }
}
function simulateFingerprintAuth() {
  showSuccess("جاري التحقق ببصمة الجوال...");
  setTimeout(() => {
    isAuthenticated = true;
    showSuccess("تم التحقق بنجاح!");
    document.getElementById("loginModal").style.display = "none";
    openEditPanel();
  }, 1500);
}

// فتح لوحة التحكم
function openEditPanel() {
  if (!isAuthenticated) return;
  document.getElementById("editName").value = document.getElementById("name").innerText;
  document.getElementById("editJob").value = document.getElementById("job").innerText;
  document.getElementById("editHeaderBgSelect").value = document.getElementById("header").style.background || defaultSettings.headerBg;
  document.getElementById("editCopyright").value = document.getElementById("footerCopyright").innerText;
  document.getElementById("editProfileShape").value = window.getComputedStyle(document.getElementById("profileImg")).borderRadius;

  // تعبئة حقول الأقسام
  document.getElementById("editEventsTitle").value = document.getElementById("eventsTitle").innerText;
  document.getElementById("editEvent1").value = document.getElementById("event1").innerText;
  document.getElementById("editEvent2").value = document.getElementById("event2").innerText;
  document.getElementById("editChronicTitle").value = document.getElementById("chronicTitle").innerText;
  document.getElementById("editChronicList").value = localStorage.getItem("chronicList") || "";
  document.getElementById("editUpcomingProjectsTitle").value = document.getElementById("upcomingProjectsTitle").innerText;
  document.getElementById("editProjectsList").value = localStorage.getItem("projectsList") || "";
  document.getElementById("editTestimonialsTitle").value = document.getElementById("testimonialsTitle").innerText;
  document.getElementById("editTestimonialsContent").value = document.getElementById("testimonialsContent").innerText;
  document.getElementById("editCertificatesCount").value = localStorage.getItem("certificatesCount") || 1;
  
  // استعادة الصور إن وجدت
  const storedProfileImage = localStorage.getItem("profileImage");
  if(storedProfileImage) {
    document.getElementById("profileImg").src = storedProfileImage;
  }
  const storedCertificate = localStorage.getItem("certificateImage");
  if(storedCertificate) {
    document.getElementById("certificateImg").src = storedCertificate;
  }

  document.getElementById("editPanel").style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// حفظ التغييرات
function saveEdits() {
  const newName = document.getElementById("editName").value.trim();
  const newJob = document.getElementById("editJob").value.trim();
  const newHeaderBg = document.getElementById("editHeaderBgSelect").value.trim();
  const newCopyright = document.getElementById("editCopyright").value.trim();
  const newProfileShape = document.getElementById("editProfileShape").value;
  const newPortfolioLayout = document.getElementById("portfolioLayout").value;

  if (!newName || !newJob || !newHeaderBg || !newCopyright) {
    showError("الرجاء تعبئة جميع الحقول المطلوبة");
    return;
  }
  document.getElementById("name").innerText = newName;
  document.getElementById("job").innerText = newJob;
  document.getElementById("header").style.background = newHeaderBg;
  document.getElementById("footerCopyright").innerText = newCopyright;
  document.getElementById("profileImg").style.borderRadius = newProfileShape;

  document.getElementById("eventsTitle").innerText = document.getElementById("editEventsTitle").value.trim();
  document.getElementById("event1").innerText = document.getElementById("editEvent1").value.trim();
  document.getElementById("event2").innerText = document.getElementById("editEvent2").value.trim();

  document.getElementById("chronicTitle").innerText = document.getElementById("editChronicTitle").value.trim();
  const chronicList = document.getElementById("editChronicList").value.trim();
  localStorage.setItem("chronicList", chronicList);
  document.getElementById("chronicContent").innerText = chronicList ? chronicList.split(",").join(" - ") : "";

  document.getElementById("upcomingProjectsTitle").innerText = document.getElementById("editUpcomingProjectsTitle").value.trim();
  const projectsList = document.getElementById("editProjectsList").value.trim();
  localStorage.setItem("projectsList", projectsList);
  document.getElementById("upcomingProjectsContent").innerText = projectsList ? projectsList.split(",").join(" - ") : "";

  document.getElementById("testimonialsTitle").innerText = document.getElementById("editTestimonialsTitle").value.trim();
  document.getElementById("testimonialsContent").innerText = document.getElementById("editTestimonialsContent").value.trim();

  const certificatesCount = document.getElementById("editCertificatesCount").value.trim();
  localStorage.setItem("certificatesCount", certificatesCount);
  document.getElementById("certificatesCount").innerText = `عدد الشهادات: ${certificatesCount}`;

  // تخزين الإعدادات في Local Storage
  localStorage.setItem("profileName", newName);
  localStorage.setItem("profileJob", newJob);
  localStorage.setItem("headerBg", newHeaderBg);
  localStorage.setItem("footerCopyright", newCopyright);
  localStorage.setItem("profileShape", newProfileShape);
  localStorage.setItem("portfolioLayout", newPortfolioLayout);

  applyPortfolioLayout(newPortfolioLayout);
  closeEditPanel();
  showSuccess("تم الحفظ بنجاح!");
}

// إعادة الإعدادات الافتراضية
function resetDefaults() {
  document.getElementById("editName").value = "فهد";
  document.getElementById("editJob").value = "مطور ويب محترف";
  document.getElementById("editHeaderBgSelect").value = defaultSettings.headerBg;
  document.getElementById("editCopyright").value = `جميع الحقوق محفوظة © ${new Date().getFullYear()}`;
  document.getElementById("editProfileShape").value = "50%";
  document.getElementById("editEventsTitle").value = "الأحداث القادمة";
  document.getElementById("editEvent1").value = "حدث 1 - 25 ديسمبر 2024";
  document.getElementById("editEvent2").value = "حدث 2 - 10 يناير 2025";
  document.getElementById("editChronicTitle").value = "امراض مزمنة";
  document.getElementById("editChronicList").value = "";
  document.getElementById("editUpcomingProjectsTitle").value = "المشاريع القادمة";
  document.getElementById("editProjectsList").value = "";
  document.getElementById("editTestimonialsTitle").value = "شهادات";
  document.getElementById("editTestimonialsContent").value = "محتوى قسم الشهادات هنا.";
  document.getElementById("editCertificatesCount").value = 1;
  showSuccess("تمت إعادة الإعدادات الإفتراضية");
}

function closeEditPanel() {
  document.getElementById("editPanel").style.display = "none";
  isAuthenticated = false;
}

function showError(message) {
  const errorElem = document.getElementById("loginError");
  errorElem.innerText = message;
  setTimeout(() => errorElem.innerText = "", 3000);
}
function showSuccess(message) {
  const successElem = document.createElement("div");
  successElem.style.position = "fixed";
  successElem.style.bottom = "20px";
  successElem.style.left = "50%";
  successElem.style.transform = "translateX(-50%)";
  successElem.style.backgroundColor = "#2ecc71";
  successElem.style.color = "white";
  successElem.style.padding = "15px 30px";
  successElem.style.borderRadius = "25px";
  successElem.style.boxShadow = "0 3px 15px rgba(0,0,0,0.2)";
  successElem.innerText = message;
  document.body.appendChild(successElem);
  setTimeout(() => successElem.remove(), 2000);
}

// معالجة رفع صورة البروفايل
document.getElementById("editProfileImage").addEventListener("change", function(){
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      document.getElementById("profileImg").src = e.target.result;
      localStorage.setItem("profileImage", e.target.result);
    }
    reader.readAsDataURL(file);
  }
});

// معالجة رفع صورة الشهادة
document.getElementById("editCertificateImage").addEventListener("change", function(){
  const file = this.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      document.getElementById("certificateImg").src = e.target.result;
      localStorage.setItem("certificateImage", e.target.result);
    }
    reader.readAsDataURL(file);
  }
});

// فلترة البورتفوليو
function filterPortfolio(category) {
  document.querySelectorAll(".portfolio-card").forEach((card) => {
    card.style.display = category === "all" || card.dataset.category === category ? "block" : "none";
  });
}

// إرسال الرسالة من نموذج التواصل
function sendMessage(e) {
  e.preventDefault();
  alert("تم إرسال رسالتك بنجاح!");
}

// تبديل الوضع الليلي/النهاري
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  const newTheme = current === "light" ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// دعم السحب باستخدام HammerJS
var hammer = new Hammer(document.body);
hammer.on("swipeleft", function () {
  console.log("تم السحب لليسار!");
});

// تبديل اللغة
function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  updateLanguage();
}
function toggleLanguage() {
  const currentLang = localStorage.getItem("lang") || "ar";
  const newLang = currentLang === "ar" ? "en" : "ar";
  setLanguage(newLang);
}
function updateLanguage() {
  const lang = localStorage.getItem("lang") || "ar";
  if (lang === "en") {
    document.getElementById("name").innerText = "Fahad";
    document.getElementById("job").innerText = "Professional Web Developer";
    document.getElementById("skillsTitle").innerText = "My Skills";
    document.getElementById("skill1Title").innerText = "Web Development";
    document.getElementById("skill1Desc").innerText = "Building complete web applications";
    document.getElementById("skill2Title").innerText = "Responsive Design";
    document.getElementById("skill2Desc").innerText = "Designs that work on all devices";
    document.getElementById("skill3Title").innerText = "Performance Optimization";
    document.getElementById("skill3Desc").innerText = "Speeding up and enhancing site performance";
    document.getElementById("portfolioTitle").innerText = "Portfolio";
    document.getElementById("project1Title").innerText = "Project 1";
    document.getElementById("project1Desc").innerText = "Brief project description highlighting used technologies.";
    document.getElementById("project2Title").innerText = "Project 2";
    document.getElementById("project2Desc").innerText = "Details of another project with graphics or images.";
    document.getElementById("project3Title").innerText = "Project 3";
    document.getElementById("project3Desc").innerText = "Practical application showcasing skills in various fields.";
    document.getElementById("contactTitle").innerText = "Contact Me";
    document.getElementById("contactBtn").innerText = "Send";
    document.getElementById("eventsTitle").innerText = "Upcoming Events";
    document.getElementById("shareTitle").innerText = "Share Profile";
    document.getElementById("loginTitle").innerText = "User Verification";
    document.getElementById("loginBtn").innerText = "Login";
    document.getElementById("fingerprintBtn").innerText = "Verify with Fingerprint";
    document.getElementById("editTitle").innerText = "Control Panel";
    document.getElementById("editNameLabel").innerText = "Full Name:";
    document.getElementById("editJobLabel").innerText = "Job Title:";
    document.getElementById("editImgLabel").innerText = "Change Profile Image:";
    document.getElementById("editHeaderLabel").innerText = "Choose Header Background:";
    document.getElementById("editCopyLabel").innerText = "Copyright Text:";
    document.getElementById("editShapeLabel").innerText = "Choose Profile Image Shape:";
    document.getElementById("saveEditsBtn").innerText = "Save Changes";
    document.getElementById("cancelEditsBtn").innerText = "Cancel";
    document.getElementById("editEventsTitle").placeholder = "Events Title";
    document.getElementById("editChronicTitle").placeholder = "Chronic Title";
    document.getElementById("editChronicList").placeholder = "Disease1, Disease2, ...";
    document.getElementById("editUpcomingProjectsTitle").placeholder = "Upcoming Projects Title";
    document.getElementById("editProjectsList").placeholder = "Project1, Project2, ...";
    document.getElementById("editTestimonialsTitle").placeholder = "Testimonials Title";
    document.getElementById("editTestimonialsContent").placeholder = "Testimonials Content";
    document.getElementById("footerCopyright").innerText = `All rights reserved © ${new Date().getFullYear()}`;
  } else {
    document.getElementById("name").innerText = "فهد";
    document.getElementById("job").innerText = "مطور ويب محترف";
    document.getElementById("skillsTitle").innerText = "مهاراتي";
    document.getElementById("skill1Title").innerText = "تطوير الويب";
    document.getElementById("skill1Desc").innerText = "تطوير مواقع وتطبيقات ويب متكاملة";
    document.getElementById("skill2Title").innerText = "التصميم المتجاوب";
    document.getElementById("skill2Desc").innerText = "تصميم متوافق مع جميع الأجهزة";
    document.getElementById("skill3Title").innerText = "تحسين الأداء";
    document.getElementById("skill3Desc").innerText = "تحسين سرعة وأداء المواقع";
    document.getElementById("portfolioTitle").innerText = "بورتفوليو";
    document.getElementById("project1Title").innerText = "مشروع 1";
    document.getElementById("project1Desc").innerText = "وصف مختصر للمشروع مع إبراز التقنيات المستخدمة.";
    document.getElementById("project2Title").innerText = "مشروع 2";
    document.getElementById("project2Desc").innerText = "تفاصيل عن مشروع آخر مع بعض الرسوم البيانية أو صور توضيحية.";
    document.getElementById("project3Title").innerText = "مشروع 3";
    document.getElementById("project3Desc").innerText = "تطبيق عملي يعرض قدراتك في مجالات مختلفة من البرمجة والتصميم.";
    document.getElementById("contactTitle").innerText = "اتصل بي";
    document.getElementById("contactBtn").innerText = "إرسال";
    document.getElementById("eventsTitle").innerText = "الأحداث القادمة";
    document.getElementById("shareTitle").innerText = "شارك البروفايل";
    document.getElementById("loginTitle").innerText = "التحقق من الهوية";
    document.getElementById("loginBtn").innerText = "دخول";
    document.getElementById("fingerprintBtn").innerText = "تحقق ببصمة الجوال";
    document.getElementById("editTitle").innerText = "لوحة التحكم";
    document.getElementById("editNameLabel").innerText = "الاسم الكامل:";
    document.getElementById("editJobLabel").innerText = "المسمى الوظيفي:";
    document.getElementById("editImgLabel").innerText = "تغيير صورة البروفايل:";
    document.getElementById("editHeaderLabel").innerText = "اختر خلفية الهيدر:";
    document.getElementById("editCopyLabel").innerText = "نص الحقوق:";
    document.getElementById("editShapeLabel").innerText = "اختر شكل الصورة الشخصية:";
    document.getElementById("saveEditsBtn").innerText = "حفظ التغييرات";
    document.getElementById("cancelEditsBtn").innerText = "إلغاء";
    document.getElementById("editEventsTitle").placeholder = "";
    document.getElementById("editChronicTitle").placeholder = "";
    document.getElementById("editChronicList").placeholder = "";
    document.getElementById("editUpcomingProjectsTitle").placeholder = "";
    document.getElementById("editProjectsList").placeholder = "";
    document.getElementById("editTestimonialsTitle").placeholder = "";
    document.getElementById("editTestimonialsContent").placeholder = "";
    document.getElementById("footerCopyright").innerText = `جميع الحقوق محفوظة © ${new Date().getFullYear()}`;
  }
}

// استعادة الإعدادات من Local Storage
function restoreSettings() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    document.documentElement.setAttribute("data-theme", storedTheme);
  }
  const storedName = localStorage.getItem("profileName");
  if (storedName) {
    document.getElementById("name").innerText = storedName;
  }
  const storedJob = localStorage.getItem("profileJob");
  if (storedJob) {
    document.getElementById("job").innerText = storedJob;
  }
  const storedHeaderBg = localStorage.getItem("headerBg");
  if (storedHeaderBg) {
    document.getElementById("header").style.background = storedHeaderBg;
  }
  const storedCopyright = localStorage.getItem("footerCopyright");
  if (storedCopyright) {
    document.getElementById("footerCopyright").innerText = storedCopyright;
  }
  const storedProfileShape = localStorage.getItem("profileShape");
  if (storedProfileShape) {
    document.getElementById("profileImg").style.borderRadius = storedProfileShape;
  }
  const storedImage = localStorage.getItem("profileImage");
  if (storedImage) {
    document.getElementById("profileImg").src = storedImage;
  }
  const storedCertificate = localStorage.getItem("certificateImage");
  if (storedCertificate) {
    document.getElementById("certificateImg").src = storedCertificate;
  }
  ["portfolioSection", "eventsSection", "chronicSection", "upcomingProjectsSection", "testimonialsSection"].forEach((sectionId) => {
    const displayVal = localStorage.getItem(sectionId);
    if (displayVal) {
      document.getElementById(sectionId).style.display = displayVal;
    }
  });
  const eventsTitle = localStorage.getItem("eventsTitle");
  if (eventsTitle) {
    document.getElementById("eventsTitle").innerText = eventsTitle;
  }
  const event1 = localStorage.getItem("event1");
  if (event1) {
    document.getElementById("event1").innerText = event1;
  }
  const event2 = localStorage.getItem("event2");
  if (event2) {
    document.getElementById("event2").innerText = event2;
  }
  const chronicTitle = localStorage.getItem("chronicTitle");
  if (chronicTitle) {
    document.getElementById("chronicTitle").innerText = chronicTitle;
  }
  const chronicContent = localStorage.getItem("chronicContent");
  if (chronicContent) {
    document.getElementById("chronicContent").innerText = chronicContent;
  }
  const upcomingProjectsTitle = localStorage.getItem("upcomingProjectsTitle");
  if (upcomingProjectsTitle) {
    document.getElementById("upcomingProjectsTitle").innerText = upcomingProjectsTitle;
  }
  const upcomingProjectsContent = localStorage.getItem("upcomingProjectsContent");
  if (upcomingProjectsContent) {
    document.getElementById("upcomingProjectsContent").innerText = upcomingProjectsContent;
  }
  const testimonialsTitle = localStorage.getItem("testimonialsTitle");
  if (testimonialsTitle) {
    document.getElementById("testimonialsTitle").innerText = testimonialsTitle;
  }
  const testimonialsContent = localStorage.getItem("testimonialsContent");
  if (testimonialsContent) {
    document.getElementById("testimonialsContent").innerText = testimonialsContent;
  }
  const storedLayout = localStorage.getItem("portfolioLayout");
  if (storedLayout) {
    applyPortfolioLayout(storedLayout);
  }
  const chronicList = localStorage.getItem("chronicList");
  if (chronicList) {
    document.getElementById("chronicContent").innerText = chronicList.split(",").join(" - ");
  }
  const projectsList = localStorage.getItem("projectsList");
  if (projectsList) {
    document.getElementById("upcomingProjectsContent").innerText = projectsList.split(",").join(" - ");
  }
  const certificatesCount = localStorage.getItem("certificatesCount");
  if (certificatesCount) {
    document.getElementById("certificatesCount").innerText = `عدد الشهادات: ${certificatesCount}`;
  }
  updateLanguage();
}

// تطبيق تخطيط البورتفوليو
function applyPortfolioLayout(layout) {
  if (layout === "list") {
    document.querySelector(".portfolio-grid").style.display = "block";
    document.querySelector(".portfolio-grid").style.gridTemplateColumns = "1fr";
  } else {
    document.querySelector(".portfolio-grid").style.display = "grid";
    document.querySelector(".portfolio-grid").style.gridTemplateColumns = "repeat(auto-fit, minmax(250px, 1fr))";
  }
}

// تبويبات لوحة التحكم
document.querySelectorAll(".edit-tabs .tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".edit-tabs .tab").forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
    document.getElementById(tab.dataset.tab).classList.add("active");
  });
});
