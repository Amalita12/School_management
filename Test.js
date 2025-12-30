const storedHistoryData = JSON.parse(localStorage.getItem("historyData")) || [];

// DOM
const joursContainer = document.getElementById("joursContainer");
const detailDate = document.getElementById("detailDate");
const absentsContainer = document.querySelector(".flex.flex-col.gap-2");
const input = document.getElementById("input");

function convertirDateISO(dateText) {
  const mois = {
    January: "01", February: "02", March: "03",
    April: "04", May: "05", June: "06",
    July: "07", August: "08", September: "09",
    October: "10", November: "11", December: "12"
  };

  const parts = dateText.split(" ");
  // Mercredi 17 December 2025
  return `${parts[3]}-${mois[parts[2]]}-${parts[1]}`;
}

// Générer les jours
function genererJours() {
  joursContainer.innerHTML = "";

  if (storedHistoryData.length === 0) {
    joursContainer.innerHTML =
      `<p class="text-white text-sm">Aucune donnée enregistrée</p>`;
    return;
  }

  storedHistoryData.forEach((day, index) => {
    const absentsCount = day.absents.length;
    const retardsCount = day.retards.length;

    const jourDiv = document.createElement("div");
    jourDiv.className = "jour pb-2 pl-5 rounded-lg my-1 bg-black";
    jourDiv.dataset.date = convertirDateISO(day.date);

    jourDiv.innerHTML = `
      <div class="flex gap-6 p-2 px-5 text-white">
        <img class="size-6 invert mt-2" src="Pictures/Absence.png">
        <div>
          <p class="date text-xs">${day.date}</p>
          <p class="detail text-xs text-gray-400 pt-1">
            <span class="bnrAbsent">${absentsCount}</span> absent ·
            <span class="bnrRetard">${retardsCount}</span> retards
          </p>
        </div>
      </div>
      <button
        data-index="${index}"
        class="btnDetails bg-purple-600 text-xs ml-20 px-8 text-white hover:bg-purple-700 py-1 rounded-lg">
        Voir détails
      </button>
    `;

    joursContainer.appendChild(jourDiv);
  });

  activerBoutonsDetails();
}

// Activer "Voir détails"
 
function activerBoutonsDetails() {
  document.querySelectorAll(".btnDetails").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      afficherDetails(storedHistoryData[index]);
      detailDate.scrollIntoView({ behavior: "smooth" });
    });
  });
}
function genererSyno(nomComplet) {
  if (!nomComplet) return "";

  const parties = nomComplet.trim().split(" ");
  const prenom = parties[0];
  const nom = parties[parties.length - 1];

  return (prenom[0] + nom[0]).toUpperCase();
}

// Afficher (absents & retards)
 
function afficherDetails(day) {
  if (!day) return;

  absentsContainer.innerHTML = "";
  detailDate.textContent = `Details - ${day.date}`;

  // Absent
  if (day.absents.length > 0) {
    const title = document.createElement("p");
    absentsContainer.appendChild(title);

    day.absents.forEach(a => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center pr-2 pl-5 rounded-lg bg-black";

      div.innerHTML = `
        <div class="flex items-center gap-6 p-2 px-5 text-white">
           <div class="syno bg-orange-400 p-2 h-10 rounded-lg">
            ${genererSyno(a.nom)}</div>          
            <div>
            <p class="nom text-xs">${a.nom}</p>
            <p class="text-xs text-gray-400 pt-1">
              Group <span class="group">${a.group}</span> ·
              ID : <span class="etudiantId">${a.id}</span>
            </p>
          </div>
        </div>
        <button class="bg-red-700 text-xs ml-20 px-8 text-white py-1 rounded-lg">
          Absent
        </button>
      `;
      absentsContainer.appendChild(div);
    });
  } else {
    const p = document.createElement("p");
    p.className = "text-red-600 mb-2 font-bold";
    p.textContent = "Aucun absent";
    absentsContainer.appendChild(p);
  }

  // Retard
  if (day.retards.length > 0) {
    const title = document.createElement("p");
    title.className = "text-orange-400 mb-2 font-bold";
    title.textContent = "Retards";
    absentsContainer.appendChild(title);

    day.retards.forEach(r => {
      const div = document.createElement("div");
      div.className = "flex justify-between items-center pr-2 pl-5 rounded-lg bg-black";

      div.innerHTML = `
        <div class="flex items-center gap-6 p-2 px-5 text-white">
          <div class="syno bg-green-400 p-2 h-10 rounded-lg">
            ${genererSyno(r.nom)}
            </div>
            <div>
            <p class="nom text-xs">${r.nom}</p>
            <p class="text-xs text-gray-400 pt-1">
              Group <span class="group">${r.group}</span> ·
              ID : <span class="etudiantId">${r.id}</span>
            </p>
          </div>
        </div>
        <button class="bg-orange-400 text-xs ml-20 px-8 text-white py-1 rounded-lg">
          ${r.duree} min retard
        </button>
      `;
      absentsContainer.appendChild(div);
    });
  }
}

//Filtre par date
input.addEventListener("input", () => {
  const value = input.value;

  document.querySelectorAll(".jour").forEach(jour => {
    jour.style.display =
      jour.dataset.date.includes(value) ? "block" : "none";
  });
});

genererJours();
