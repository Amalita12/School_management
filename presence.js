

// ATTENDANCE DATA
let attendanceTemp = {};
let currentIndex = null;

//  SYNCHRONIZE STUDENTS
function updateEtudiantsFromStudents() {
  window.etudiants = students.map((s, index) => ({
    id: s.id,
    name: s.name,
    email: s.email,
    group: s.group
  }));

  // Supprime les entrées d'attendance pour étudiants supprimés
  Object.keys(attendanceTemp).forEach(index => {
    if (!window.etudiants[index]) delete attendanceTemp[index];
  });
}

//  SHOW STUDENTS (ATTENDANCE)
function showStudents() {
  let infodisplay = document.getElementById("infodisply");
  infodisplay.innerHTML = "";

  for (let i = 0; i < window.etudiants.length; i++) {
    infodisplay.innerHTML += studentHTML(i);
  }
}

function studentHTML(i) {
  return `
    <div class="bg-black p-3 rounded-lg text-white flex justify-between items-center">
      <div class="flex gap-4 items-center">
        <div class="bg-orange-400 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-black">
          ${window.etudiants[i].name[0]}
        </div>
        <div>
          <h2 class="text-xl font-bold">${window.etudiants[i].name}</h2>
          <p class="text-xs text-gray-400">ID: ${window.etudiants[i].id}</p>
          <p class="text-xs text-gray-400">Group ${window.etudiants[i].group}</p>
        </div>
      </div>

      <div class="flex gap-2 bg-sky-950 p-2 rounded">
        <button class="attendance px-3 py-1 rounded" 
                data-index="${i}" data-status="Present" onclick="setAttendance(this)">Present</button>
        <button class="attendance px-3 py-1 rounded" 
                data-index="${i}" data-status="Absent" onclick="setAttendance(this)">Absent</button>
        <button class="attendance px-3 py-1 rounded" 
                data-index="${i}" data-status="Retard" onclick="setAttendance(this)">Retard</button>
      </div>
    </div>
  `;
}


// SET ATTENDANCE
function setAttendance(button) {
  let index = button.dataset.index;
  let status = button.dataset.status;

  currentIndex = index;

  attendanceTemp[index] = {
    id: window.etudiants[index].id,
    name: window.etudiants[index].name,
    status: status,
    heure: "",
    motif: ""
  };

  // Color buttons
  let parent = button.parentElement;
  let allButtons = parent.querySelectorAll("button");
  allButtons.forEach(btn => btn.classList.remove("bg-green-500", "bg-red-500", "bg-orange-400"));

  if (status === "Present") button.classList.add("bg-green-500");
  if (status === "Absent") button.classList.add("bg-red-500");
  if (status === "Retard") button.classList.add("bg-orange-400");

  // Show retard info
  let retardDiv = document.getElementById("retard-info");
  retardDiv.style.display = (status === "Retard") ? "block" : "none";
}

// RETARD INFO
document.getElementById("heure-arrivee").addEventListener("change", function() {
  if (currentIndex === null) return;
  attendanceTemp[currentIndex].heure = this.value;
});

document.getElementById("motif-retard").addEventListener("input", function() {
  if (currentIndex === null) return;
  attendanceTemp[currentIndex].motif = this.value;
});

// SAVE / LOAD ATTENDANCE
function saveAttendance() {
  let date = document.querySelector('input[type="date"]').value;
  if (!date) { alert("Choisir une date"); return; }

  let all = JSON.parse(localStorage.getItem("attendance")) || {};
  all[date] = attendanceTemp;

  localStorage.setItem("attendance", JSON.stringify(all));
  alert("Présence enregistrée ✅");
}

function loadAttendanceForDate() {
  let date = document.querySelector('input[type="date"]').value;
  let all = JSON.parse(localStorage.getItem("attendance")) || {};
  attendanceTemp = all[date] || {};

  showStudents();

  // Color buttons
  for (let index in attendanceTemp) {
    let status = attendanceTemp[index].status;
    let buttons = document.querySelectorAll(`button[data-index="${index}"]`);
    buttons.forEach(btn => {
      if (btn.dataset.status === status) {
        if (status === "Present") btn.classList.add("bg-green-500");
        if (status === "Absent") btn.classList.add("bg-red-500");
        if (status === "Retard") btn.classList.add("bg-orange-400");
      }
    });
  }
}

// SEARCH
function searchStudents(text) {
  let infodisplay = document.getElementById("infodisply");
  infodisplay.innerHTML = "";
  let search = text.toLowerCase();
  let found = false;

  for (let i = 0; i < window.etudiants.length; i++) {
    let name = window.etudiants[i].name.toLowerCase();
    let id = window.etudiants[i].id.toString();
    let group = window.etudiants[i].group.toString();

    if (name.includes(search) || id.includes(search) || group.includes(search)) {
      infodisplay.innerHTML += studentHTML(i);
      found = true;
    } 
  }

  if (!found && text !== "") console.log("Aucun personne trouvé !");
}

//  INIT

document.addEventListener("DOMContentLoaded", function () {
  updateEtudiantsFromStudents(); 
  showStudents();
  loadAttendanceForDate();

  document.querySelector('input[type="date"]').addEventListener("change", loadAttendanceForDate);
  document.querySelector("button.bg-blue-500").addEventListener("click", saveAttendance);

  let searchInput = document.querySelector('input[placeholder="search"]');
  searchInput.addEventListener("input", function() {
    searchStudents(this.value);
  });
});
