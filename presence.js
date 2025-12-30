

const container = document.querySelector("#infodisply");


document.addEventListener("DOMContentLoaded", function () {
  studentHTML();
  loadAttendanceForDate();

// modifier date
  document.querySelector('input[type="date"]').addEventListener("change", loadAttendanceForDate);

  //button save
  document.querySelector("button.bg-blue-500").addEventListener("click", saveAttendance);

  // input search
  let searchInput = document.querySelector('input[placeholder="search"]');
  searchInput.addEventListener("input", function() {
    searchStudents(this.value);
  });
});

document.addEventListener('DOMContentLoaded', () => {
    init();
});

let students = JSON.parse(localStorage.getItem("students"));
function init() {
    console.log(students)
    if (!students || students.length === 0) {
        students = [
            { id: 1, name: "Zaidi Hamza", email: "email@example.com", group: 2 },
            { id: 2, name: "Amina Benali", email: "amina@example.com", group: 1 },
            { id: 3, name: "Karim Safi", email: "karim@example.com", group: 2 }
       
        ];
        localStorage.setItem("students", JSON.stringify(students));
    }}


//show students


function studentHTML() {
  // container.innerHTML="";

  students.forEach((item)=>{
    let div = document.createElement('div');
    div.classList.add('persone')
    div.innerHTML = `
    <div class="bg-black p-3 rounded-lg text-white flex justify-between items-center">
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
                 data-status="Present" onclick="setAttendance(this)">Present</button>
        <button class="attendance px-3 py-1 rounded" 
                data-status="Absent" onclick="setAttendance(this)">Absent</button>
        <button class="attendance px-3 py-1 rounded" 
                 data-status="Retard" onclick="setAttendance(this)">Retard</button>
      </div>
    </div>
  `;

    container.append(div);
  })

}




 let dataset =[];
function setAttendance(button) {
  let status = button.dataset.status;
   dataset = [
  {
    date: "2025-01-02",
    absents: [
      {id:"123", nom:"mouad", group:"4"}
    ],

    retards: [
      {id:"123", nom:"mouad", group:"4", duree: "12:2", motif: "fkfkf"},
      {id:"133", nom:"ahmad", group:"5", duree: "12:2", motif: "fkfkf"}
    ],

    present: [
      {id:"123", nom:"ibrahim", group:"4"},
    ]
  },
]

  //  colorie button
  let parent = button.parentElement;
  let allButtons = parent.querySelectorAll("button");
  for (let i = 0; i < allButtons.length; i++) {
    allButtons[i].classList.remove("bg-green-500", "bg-red-500", "bg-orange-400");
  }

  if (status === "Present") button.classList.add("bg-green-500");
  if (status === "Absent") button.classList.add("bg-red-500");
  if (status === "Retard") button.classList.add("bg-orange-400");

//show  retard if click retard 
  let retardDiv = document.getElementById("retard-info");
  if (status === "Retard") {
    retardDiv.style.display = "block";
  } else {
    retardDiv.style.display = "none";
  }
}

// =====================
// info retard
// =====================

  document.querySelectorAll(".persone").forEach(el => {
    console.log(el)
  })



document.getElementById("heure-arrivee").addEventListener("change", function() {
  if (currentIndex === null) return;
  attendanceTemp[currentIndex].heure = this.value;
});

document.getElementById("motif-retard").addEventListener("input", function() {
  if (currentIndex === null) return;
  attendanceTemp[currentIndex].motif = this.value;
});

// save presence
function saveAttendance() {
  let date = document.querySelector('input[type="date"]').value;
  if (date === "") {
    alert("Choisir une date");
    return;
  }



  let all = JSON.parse(localStorage.getItem("attendance")) || {};
  all[date] = attendanceTemp;

  localStorage.setItem("attendance", JSON.stringify(all));
  alert("Présence enregistrée ✅");
}


// save absent
function loadAttendanceForDate() {
  let date = document.querySelector('input[type="date"]').value;
  let all = JSON.parse(localStorage.getItem("attendance")) || {};
  attendanceTemp = all[date] || {};

 


//c
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


//  button search
function searchStudents(text) {
  let infodisplay = document.getElementById("infodisply");
  infodisplay.innerHTML = "";
  let search = text.toLowerCase();
  let found = false;
  for (let i = 0; i < etudiants.length; i++) {
    let name = etudiants[i].name.toLowerCase();
    let id = etudiants[i].id.toString();
    let group = etudiants[i].group.toString();

    if (name.includes(search) || id.includes(search) || group.includes(search)) {
      infodisplay.innerHTML += studentHTML(i);
      found = true;
    } 
   else if (!found && text !== "") {
    console.log("Aucun personne trouvé !");
  }
   
  }
}


