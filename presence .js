const container = document.querySelector("#infodisply");
let currentStudentIndex = null;
let dataset = {};
let students = [];

document.addEventListener("DOMContentLoaded", function () {
  init();
  studentHTML();
  
  // modifier date
  document.querySelector('input[type="date"]').addEventListener("change", loadAttendanceForDate);

  // button save
  document.querySelector("button.bg-blue-500").addEventListener("click", saveAttendance);

  // input search
  let searchInput = document.querySelector('input[placeholder="search"]');
  if (searchInput) {
    searchInput.addEventListener("input", function() {
      searchStudents(this.value);
    });
  }
});

function init() {
  //Données d'étudiants crées et sauvegardées
  let Student = JSON.parse(localStorage.getItem("students"));
  
  if (!Student || Student.length === 0) {
    students = [
      { id: 1, name: "Zaidi Hamza", email: "email@example.com", group: 2 },
      { id: 2, name: "Amina Benali", email: "amina@example.com", group: 1 },
      { id: 3, name: "Karim Safi", email: "karim@example.com", group: 2 }
    ];
    localStorage.setItem("students", JSON.stringify(students));
  } else {
    students = Student;
  }
}

//show students
function studentHTML() {
  let infodisplay = document.getElementById("infodisply");
  if (!infodisplay) return;
  
  infodisplay.innerHTML = "";
  
  students.forEach((item, index) => {
    infodisplay.innerHTML += `
    <div class="bg-black p-3 rounded-lg text-white flex justify-between items-center mb-2 student-item" data-index="${index}">
      <div class="flex gap-4 items-center">
        <div class="bg-orange-400 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-black">
          ${item.name[0]}
        </div>
        <div>
          <h2 class="text-xl font-bold">${item.name}</h2>
          <p class="text-xs text-gray-400">ID: ${item.id}</p>
          <p class="text-xs text-gray-400">Group ${item.group}</p>
        </div>
      </div>

      <div class="flex gap-2 bg-sky-950 p-2 rounded">
        <button class="attendance px-3 py-1 rounded" 
                data-index="${index}" data-status="Present" onclick="setAttendance(this)">Present</button>
        <button class="attendance px-3 py-1 rounded" 
                data-index="${index}" data-status="Absent" onclick="setAttendance(this)">Absent</button>
        <button class="attendance px-3 py-1 rounded" 
                data-index="${index}" data-status="Retard" onclick="setAttendance(this)">Retard</button>
      </div>
    </div>
  `;
  });
}

function setAttendance(button) {
  let index = parseInt(button.getAttribute('data-index'));
  let status = button.getAttribute('data-status');
  
  currentStudentIndex = index;
  
// save status student
    dataset[index] = {
    id: students[index].id,
    name: students[index].name,
    group: students[index].group,
    status: status,
    heure: "",
    motif: ""
  };
  
  
  // colorie button
  let parent = button.parentElement;
  let allButtons = parent.querySelectorAll("button");
  
  allButtons.forEach(btn => {
    btn.classList.remove("bg-green-500", "bg-red-500", "bg-orange-400", "bg-blue-500");
  });
  
  if (status === "Present") {
    button.classList.add("bg-green-500");
  } else if (status === "Absent") {
    button.classList.add("bg-red-500");
  } else if (status === "Retard") {
    button.classList.add("bg-orange-400");
    
// info retard
    let retardDiv = document.getElementById("retard-info");
    if (retardDiv) {
      retardDiv.style.display = "block";
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const heureInput = document.getElementById("heure-arrivee");
  const motifInput = document.getElementById("motif-retard");
  
  if (heureInput) {
    heureInput.addEventListener("change", function() {
      if (currentStudentIndex !== null && dataset[currentStudentIndex]) {
        dataset[currentStudentIndex].heure = this.value;
      }
    });
  }
  
  if (motifInput) {
    motifInput.addEventListener("input", function() {
      if (currentStudentIndex !== null && dataset[currentStudentIndex]) {
        dataset[currentStudentIndex].motif = this.value;
      }
    });
  }
});

// save presence 
function saveAttendance() {
  let dateInput = document.querySelector('input[type="date"]');
  if (!dateInput) {
    alert("Champ date non trouvé!");
    return;
  }
  
  let date = dateInput.value;
  
  if (!date) {
    alert("Veuillez choisir une date!");
    return;
  }
  
  if (Object.keys(dataset).length === 0) {
    alert("Veuillez enregistrer les présences d'abord!");
    return;
  }
  
  let presenceData = {
    date: date,
    absents: [],
    retards: [],
    presents: []
  };
  
// try data pour type
  Object.values(dataset).forEach(student => {
    if (student.status === "Absent") {
      presenceData.absents.push({
        id: student.id,
        nom: student.name,
        group: student.group
      });
    } else if (student.status === "Retard") {
      presenceData.retards.push({
        id: student.id,
        nom: student.name,
        group: student.group,
        heure: student.heure,
        motif: student.motif
      });
    } else if (student.status === "Present") {
      presenceData.presents.push({
        id: student.id,
        nom: student.name,
        group: student.group
      });
    }
  });
  
  let allAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
  
  allAttendance[date] = presenceData;
  
  try {
    localStorage.setItem("attendance", JSON.stringify(allAttendance));
    alert("Présence enregistrée avec succès! ✅");
    
    dataset = {};
    
// display info retard
    let retardDiv = document.getElementById("retard-info");
    if (retardDiv) {
      retardDiv.style.display = "none";
    }
    
  } catch (error) {
    console.error("Erreur lors de la sauvegarde:", error);
    alert("Erreur lors de la sauvegarde: " + error.message);
  }
}

// load attendance
function loadAttendanceForDate() {
  let dateInput = document.querySelector('input[type="date"]');
  if (!dateInput) return;
  
  let date = dateInput.value;
  if (!date) return;
  
  let allAttendance = JSON.parse(localStorage.getItem("attendance")) || {};
  let attendanceForDate = allAttendance[date];
  
  if (!attendanceForDate) {
    console.log("Aucune donnée pour cette date");
    dataset = {};
    studentHTML();
    return;
  }
  
  
  studentHTML();
  
  dataset = {};
  
  [...attendanceForDate.absents, ...attendanceForDate.retards, ...attendanceForDate.presents].forEach(record => {

    let studentIndex = students.findIndex(s => s.id === record.id);
    
    if (studentIndex !== -1) {

      let status = "Present";
      if (attendanceForDate.absents.some(a => a.id === record.id)) status = "Absent";
      if (attendanceForDate.retards.some(r => r.id === record.id)) status = "Retard";
      
//save dataset
      dataset[studentIndex] = {
        id: record.id,
        name: record.nom,
        group: record.group,
        status: status,
        heure: record.heure || "",
        motif: record.motif || ""
      };
      
      // colorie butons 
      let buttons = document.querySelectorAll(`button[data-index="${studentIndex}"]`);
      buttons.forEach(btn => {
        btn.classList.remove("bg-green-500", "bg-red-500", "bg-orange-400");
        
        if (btn.getAttribute('data-status') === status) {
          if (status === "Present") btn.classList.add("bg-green-500");
          else if (status === "Absent") btn.classList.add("bg-red-500");
          else if (status === "Retard") btn.classList.add("bg-orange-400");
        }
      });
    }
  });
}

// search function
function searchStudents(text) {
  let infodisplay = document.getElementById("infodisply");
  if (!infodisplay) return;
  
  infodisplay.innerHTML = "";
  let search = text.toLowerCase();
  let found = false;
  
  students.forEach((student, index) => {
    let name = student.name.toLowerCase();
    let id = student.id.toString();
    
    if (name.includes(search) || id.includes(search)) {
      found = true;
      
      infodisplay.innerHTML += `
      <div class="bg-black p-3 rounded-lg text-white flex justify-between items-center mb-2 student-item" data-index="${index}">
        <div class="flex gap-4 items-center">
          <div class="bg-orange-400 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-black">
            ${student.name[0]}
          </div>
          <div>
            <h2 class="text-xl font-bold">${student.name}</h2>
            <p class="text-xs text-gray-400">ID: ${student.id}</p>
            <p class="text-xs text-gray-400">Group ${student.group}</p>
          </div>
        </div>
  
        <div class="flex gap-2 bg-sky-950 p-2 rounded">
          <button class="attendance px-3 py-1 rounded" 
                  data-index="${index}" data-status="Present" onclick="setAttendance(this)">Present</button>
          <button class="attendance px-3 py-1 rounded" 
                  data-index="${index}" data-status="Absent" onclick="setAttendance(this)">Absent</button>
          <button class="attendance px-3 py-1 rounded" 
                  data-index="${index}" data-status="Retard" onclick="setAttendance(this)">Retard</button>
        </div>
      </div>
    `;
      
      if (dataset[index]) {
        let status = dataset[index].status;
        let studentElement = document.querySelector(`.student-item[data-index="${index}"]`);
        if (studentElement) {
          let buttons = studentElement.querySelectorAll(`button[data-index="${index}"]`);
          
          buttons.forEach(btn => {
            if (btn.getAttribute('data-status') === status) {
              btn.classList.remove("bg-green-500", "bg-red-500", "bg-orange-400");
              
              if (status === "Present") btn.classList.add("bg-green-500");
              else if (status === "Absent") btn.classList.add("bg-red-500");
              else if (status === "Retard") btn.classList.add("bg-orange-400");
            }
          });
        }
      }
    }
  });
  
  if (!found && text !== "") {
    infodisplay.innerHTML = '<p class="text-center text-gray-500 p-4">Aucun étudiant trouvé !</p>';
  }
}












 