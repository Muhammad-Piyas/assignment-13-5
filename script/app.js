const ALL_ISSUES_API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const SEARCH_API =
  "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";
const SINGLE_ISSUE_API = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";

let allIssues = [];

// 1
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if (user === "admin" && pass === "admin123") {
      window.location.href = "dashboard.html";
    } else {
      alert("Incorrect username or password!");
    }
  });
}

// 2
async function loadData() {
  const container = document.getElementById("issues-container");
  if (!container) return;

  toggleLoader(true);
  try {
    const res = await fetch(ALL_ISSUES_API);
    const data = await res.json();

    // Checking API response (if data is an object rather than a direct array)
    allIssues = Array.isArray(data) ? data : data.data || [];

    displayIssues(allIssues);
  } catch (err) {
    console.error("There was a problem loading data:", err);
  } finally {
    toggleLoader(false);
  }
}
