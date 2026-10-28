"use strict";
/* ===== EDIT THIS OBJECT WITH YOUR OWN DETAILS ===== */
const PROFILE = {
  name: "Your Name",
  role: "B.Sc. Student | Aspiring Web Developer",
  about: "I am a motivated student who enjoys building clean, useful and responsive websites. " +
         "I am learning front-end development with HTML, CSS and JavaScript and I like turning ideas into working projects.",
  education: [
    { title: "Bachelor's Degree (Your Course)", place: "Your College Name", year: "2024 – 2027", note: "Currently pursuing" },
    { title: "Higher Secondary (12th)", place: "Your School Name", year: "2022 – 2024", note: "Score / percentage" },
    { title: "Fundamentals of Web Development", place: "Naan Mudhalvan – Oracle", year: "2026", note: "Hackathon participant" }
  ],
  skills: [["HTML5", 90], ["CSS3", 85], ["JavaScript", 75], ["Responsive Design", 85], ["Git & GitHub", 70], ["Problem Solving", 80]],
  projects: [
    { title: "Student Attendance Tracker", desc: "Add students, mark daily attendance, see percentages and highlight low attendance.",
      tech: ["JavaScript", "Local Storage", "HTML/CSS"], category: "Web App", live: "https://shanavazsyed38-boop.github.io/student-attendance-tracker/" },
    { title: "Online Quiz Application", desc: "Timed multiple-choice quizzes with categories, scoring, answer review and best-score storage.",
      tech: ["JavaScript", "Local Storage", "HTML/CSS"], category: "Web App", live: "https://shanavazsyed38-boop.github.io/online-quiz-application/" },
    { title: "Personal Expense Tracker", desc: "Track income and expenses, filter transactions, view monthly summaries and a spending chart.",
      tech: ["JavaScript", "Canvas", "Local Storage"], category: "Web App", live: "https://shanavazsyed38-boop.github.io/personal-expense-tracker/" }
  ],
  github: "https://github.com/shanavazsyed38-boop"
};

const $ = (id) => document.getElementById(id);
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text) e.textContent = text; return e; }

// ---------- Render sections dynamically ----------
document.title = PROFILE.name + " | Portfolio";
$("logo").textContent = PROFILE.name;
$("heroName").textContent = PROFILE.name;
$("heroRole").textContent = PROFILE.role;
$("aboutText").textContent = PROFILE.about;
$("footer").textContent = "© " + new Date().getFullYear() + " " + PROFILE.name + " · Built with HTML, CSS and JavaScript";

PROFILE.education.forEach((e) => {
  const d = el("div", "edu"); d.append(el("b", "", e.title), el("span", "", e.place + " · " + e.year + " · " + e.note));
  $("eduList").appendChild(d);
});
PROFILE.skills.forEach(([name, pct]) => {
  const d = el("div", "skill");
  const l = el("div", "lbl"); l.append(el("span", "", name), el("span", "", pct + "%"));
  const b = el("div", "bar"), i = el("i"); i.dataset.w = pct; b.appendChild(i);
  d.append(l, b); $("skillList").appendChild(d);
});

// ---------- Projects with filtering ----------
const techs = ["All", ...new Set(PROFILE.projects.flatMap((p) => p.tech))];
let active = "All";
function renderFilters() {
  $("filters").innerHTML = "";
  techs.forEach((t) => {
    const b = el("button", "chip" + (t === active ? " on" : ""), t);
    b.setAttribute("aria-pressed", t === active);
    b.addEventListener("click", () => { active = t; renderFilters(); renderProjects(); });
    $("filters").appendChild(b);
  });
}
function renderProjects() {
  $("projectGrid").innerHTML = "";
  PROFILE.projects.filter((p) => active === "All" || p.tech.includes(active)).forEach((p) => {
    const c = el("article", "proj");
    const tags = el("div", "tags"); p.tech.forEach((t) => tags.appendChild(el("span", "", t)));
    const links = el("div", "links");
    const live = el("a", "", "Live demo"); live.href = p.live; live.target = "_blank"; live.rel = "noopener";
    const code = el("a", "", "GitHub"); code.href = PROFILE.github; code.target = "_blank"; code.rel = "noopener";
    links.append(live, code);
    c.append(el("h3", "", p.title), el("p", "", p.desc), tags, links);
    $("projectGrid").appendChild(c);
  });
}
renderFilters(); renderProjects();

// ---------- Navigation ----------
$("burger").addEventListener("click", () => {
  const open = $("menu").classList.toggle("open");
  $("burger").setAttribute("aria-expanded", open);
});
$("menu").addEventListener("click", (e) => { if (e.target.tagName === "A") $("menu").classList.remove("open"); });

const links = [...document.querySelectorAll("#menu a")];
const sections = links.map((a) => document.querySelector(a.getAttribute("href")));
window.addEventListener("scroll", () => {
  const y = window.scrollY + 120;
  let cur = -1; sections.forEach((s, i) => { if (s.offsetTop <= y) cur = i; });
  links.forEach((a, i) => a.classList.toggle("active", i === cur));
  $("toTop").hidden = window.scrollY < 400;
});
$("toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ---------- Scroll animations ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    en.target.querySelectorAll(".bar i").forEach((i) => (i.style.width = i.dataset.w + "%"));
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((s) => io.observe(s));

// ---------- Contact form validation ----------
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("cName").value.trim(), email = $("cEmail").value.trim(), msg = $("cMsg").value.trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  $("eName").textContent = name ? "" : "Name is required.";
  $("eEmail").textContent = !email ? "Email is required." : emailOk ? "" : "Enter a valid email address.";
  $("eMsg").textContent = msg ? "" : "Message is required.";
  $("formOk").textContent = "";
  if (!name || !emailOk || !msg) return;
  try {
    const all = JSON.parse(localStorage.getItem("portfolio_messages") || "[]");
    all.push({ name, email, msg, at: new Date().toISOString() });
    localStorage.setItem("portfolio_messages", JSON.stringify(all));
  } catch {}
  $("formOk").textContent = "Thank you, " + name + "! Your message has been recorded.";
  $("contactForm").reset();
});
