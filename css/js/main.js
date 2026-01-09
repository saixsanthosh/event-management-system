/* ============================================
   BACKEND URL
============================================ */
const API_BASE = "http://localhost:3000";

/* ============================================
   USER ROLE → DASHBOARD MAP
============================================ */
const dashboardMap = {
    "President": "dashboards/president.html",
    "Faculty": "dashboards/faculty.html",
    "HOD": "dashboards/hod.html",
    "VP": "dashboards/vp.html",
    "Dean": "dashboards/dean.html",
    "Coordinator": "dashboards/coordinator.html",
    "Volunteer": "dashboards/volunteer.html"
};

/* ============================================
   THEME TOGGLE
============================================ */
const themeToggle = document.getElementById("themeToggle");
if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const html = document.documentElement;
        const theme = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    });
}

/* ============================================
   PASSWORD TOGGLE
============================================ */
const passwordToggle = document.getElementById("passwordToggle");
if (passwordToggle) {
    passwordToggle.addEventListener("click", () => {
        const pwd = document.getElementById("password");
        pwd.type = pwd.type === "password" ? "text" : "password";
    });
}

/* ============================================
   LOGIN FORM (CONNECTED TO BACKEND)
============================================ */
const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            showError("Please fill all fields");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!data.success) {
                showError("Invalid username or password");
                return;
            }

            // Save session
            localStorage.setItem("userSession", JSON.stringify(data.user));

            // Redirect by role
            const role = data.user.role;
            const dashboard = dashboardMap[role];

            if (!dashboard) {
                showError("No dashboard assigned for this role");
                return;
            }

            window.location.href = dashboard;

        } catch (err) {
            showError("Backend not reachable");
        }
    });
}

/* ============================================
   ERROR HANDLER
============================================ */
function showError(msg) {
    if (errorMessage) {
        errorMessage.style.display = "flex";
        errorMessage.querySelector("span").innerText = msg;
    }
}

/* ============================================
   SESSION PROTECTION (DASHBOARDS)
============================================ */
(function protectDashboard() {
    const path = window.location.pathname;

    if (path.includes("dashboards")) {
        const session = localStorage.getItem("userSession");
        if (!session) {
            window.location.href = "../index.html";
        }
    }
})();
