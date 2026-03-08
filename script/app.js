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

// 3
function displayIssues(issues) {
  const container = document.getElementById("issues-container");
  const countEl = document.getElementById("issue-count");
  if (!container) return;

  const issueLength = issues ? issues.length : 0;
  countEl.innerText = `${issueLength} Issues`;
  container.innerHTML = "";

  if (issueLength === 0) {
    container.innerHTML =
      "<p class='col-span-4 text-center text-gray-400 py-10'>No issues found.</p>";
    return;
  }

  issues.forEach((issue) => {
    const borderClass =
      issue.status.toLowerCase() === "open"
        ? "border-t-green-500"
        : "border-t-purple-500";

    const card = document.createElement("div");
    card.className = `card bg-white shadow-sm border border-gray-100 border-t-4 ${borderClass} hover:shadow-lg cursor-pointer transition p-5`;
    card.onclick = () => showDetails(issue.id);

    card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <span class="text-[10px] font-bold uppercase px-2 py-1 bg-gray-100 rounded text-gray-500">${issue.priority || "NORMAL"}</span>
                <span class="text-[10px] text-gray-300">#${issue.id}</span>
            </div>
            <h3 class="font-bold text-sm text-gray-800 mb-2 line-clamp-2">${issue.title}</h3>
            <p class="text-[11px] text-gray-500 mb-6 line-clamp-3">${issue.description || "No description provided."}</p>
            <div class="flex gap-1 mb-4">
                <span class="badge badge-outline border-red-200 text-red-400 text-[9px] font-bold p-2 uppercase">BUG</span>
                <span class="badge badge-outline border-orange-200 text-orange-400 text-[9px] font-bold p-2 uppercase">HELP WANTED</span>
            </div>
            <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                <span class="text-[10px] font-semibold text-gray-500 italic">By @${issue.author || "unknown"}</span>
                <span class="text-[10px] text-gray-400">${issue.createdAt || ""}</span>
            </div>
        `;
    container.appendChild(card);
  });
}
