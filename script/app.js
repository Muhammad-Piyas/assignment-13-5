const all_issues_api = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const search_api =
  "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=";
const single_issue_api = "https://phi-lab-server.vercel.app/api/v1/lab/issue/";

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
    const res = await fetch(all_issues_api);
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

  if (!container || !countEl) return;

  const issueLength = issues ? issues.length : 0;
  countEl.innerText = `${issueLength} Issues`;
  container.innerHTML = "";

  if (issueLength === 0) {
    container.innerHTML =
      "<p class='col-span-4 text-center text-gray-400 py-10'>No issues found.</p>";
    return;
  }

  issues.forEach((issue) => {
    let borderClass = "";
    let iconUrl = "";

    if (issue.status.toLowerCase() === "open") {
      borderClass = "border-t-green-500";
      iconUrl = "assets/Open-Status.png";
    } else {
      borderClass = "border-t-purple-500";
      iconUrl = "assets/Closed- Status .png";
    }

    const priority = issue.priority ? issue.priority.toLowerCase() : "low";

    let priorityColor = "";

    if (priority === "high") {
      priorityColor = "text-red-500 border-red-300";
    } else if (priority === "medium") {
      priorityColor = "text-orange-500 border-orange-300";
    } else {
      priorityColor = "text-gray-500 border-gray-300";
    }

    const card = document.createElement("div");

    card.className = `bg-white shadow-sm border border-gray-100 border-t-4 ${borderClass}
    hover:shadow-lg cursor-pointer transition p-5
    flex flex-col h-full rounded-xl`;

    card.onclick = () => showDetails(issue.id);

    card.innerHTML = `
    
    <div class="flex justify-between items-center mb-4">
        <img src="${iconUrl}" class="w-5 h-5" alt="">
        <span class="text-[10px] font-bold uppercase px-3 py-1 rounded-full border ${priorityColor}">
            ${issue.priority || "LOW"}
        </span>
    </div>

    <div class="flex-grow">
        <h3 class="font-bold text-sm text-gray-800 mb-2 line-clamp-2">
            ${issue.title}
        </h3>

        <p class="text-[11px] text-gray-500 line-clamp-3">
            ${issue.description || "No description provided."}
        </p>
    </div>

    <div class="flex gap-2 mt-4">
        <span class="text-[9px] font-bold border border-red-200 text-red-400 px-2 py-1 rounded uppercase">
         <i class="fa-solid fa-bug"></i> BUG
        </span>

        <span class="text-[9px] font-bold border border-orange-200 text-orange-400 px-2 py-1 rounded uppercase">
          <i class="fa-solid fa-life-ring"></i> HELP WANTED
        </span>
    </div>

    <div class="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
        <span class="text-[10px] font-semibold text-gray-500 italic">
            By @${issue.author || "unknown"}
        </span>

        <span class="text-[10px] text-gray-400">
            ${issue.createdAt || ""}
        </span>
    </div>
    `;

    container.appendChild(card);
  });
}

// 4
async function handleSearch() {
  const query = document.getElementById("search-input").value;
  if (!query) {
    loadData();
    return;
  }

  toggleLoader(true);
  try {
    const res = await fetch(`${search_api}${query}`);
    const data = await res.json();
    const searchResults = Array.isArray(data) ? data : data.data || [];
    displayIssues(searchResults);
  } catch (err) {
    console.error("There was a problem searching:", err);
  } finally {
    toggleLoader(false);
  }
}
// 5
async function showDetails(id) {
  try {
    const res = await fetch(`${single_issue_api}${id}`);
    const data = await res.json();
    const issue = data.data; // API response structure

    const modal = document.getElementById("issue_modal");
    const content = document.getElementById("modal-content");

    const statusColor =
      issue.status === "open" ? "badge-success" : "badge-secondary";

    content.innerHTML = `
      <h2 class="text-xl font-bold mb-2">${issue.title}</h2>

      <div class="flex items-center gap-2 mb-4">
        <span class="badge ${statusColor} text-white font-bold text-xs uppercase">
          ${issue.status}
        </span>

        <span class="text-xs text-gray-400">
          Opened by <b class="text-gray-700">${issue.author}</b>  • ${issue.createdAt}
        </span>
      </div>

        <div class="flex gap-2 mt-4">
        <span class="text-[9px] font-bold border border-red-200 text-red-400 px-2 py-1 rounded uppercase">
         <i class="fa-solid fa-bug"></i> BUG
        </span>

        <span class="text-[9px] font-bold border border-orange-200 text-orange-400 px-2 py-1 rounded uppercase">
          <i class="fa-solid fa-life-ring"></i> HELP WANTED
        </span>
    </div>


      <p class="text-gray-600 text-sm leading-relaxed mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
        ${issue.description}
      </p>

      <div class="grid grid-cols-2 gap-4">

        <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Assignee:</p>
          <p class="font-bold text-gray-800 text-sm italic">${issue.author}</p>
        </div>

        <div class="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Priority:</p>
          <span class="badge badge-error text-white font-bold text-[10px] uppercase">
            ${issue.priority}
          </span>
        </div>

      </div>
    `;

    modal.showModal();
  } catch (err) {
    alert("Unable to load issue details.");
  }
}

// 6
function filterIssues(status) {
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((btn) => btn.classList.remove("bg-[#6366F1]", "text-white"));

  const activeBtn = document.getElementById(`tab-${status}`);
  if (activeBtn) activeBtn.classList.add("bg-[#6366F1]", "text-white");

  if (status === "all") {
    displayIssues(allIssues);
  } else {
    const filtered = allIssues.filter((i) => i.status.toLowerCase() === status);
    displayIssues(filtered);
  }
}

function toggleLoader(show) {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.toggle("hidden", !show);
}

loadData();
