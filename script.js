let data = JSON.parse(localStorage.getItem("depenses")) || [];

function ajouterDepense() {
    let libelle = document.getElementById("libelle").value;
    let montant = document.getElementById("montant").value;
    let date = document.getElementById("date").value;
    if (!libelle || !montant || !date) return;

    data.push({ libelle, montant, date });
    localStorage.setItem("depenses", JSON.stringify(data));
    afficherDepenses();
}

function afficherDepenses() {
    let liste = document.getElementById("listeDepenses");
    liste.innerHTML = "";

    let moisSelect = document.getElementById("moisSelect");
    let moisSelectionne = moisSelect.value;

    data.filter(d => d.date.startsWith(moisSelectionne)).forEach(d => {
        let li = document.createElement("li");
        li.textContent = `${d.date} - ${d.libelle}: ${d.montant}€`;
        liste.appendChild(li);
    });
}

function remplirListeMois() {
    let moisSelect = document.getElementById("moisSelect");
    let mois = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    let annee = new Date().getFullYear();

    mois.forEach(m => {
        let option = document.createElement("option");
        option.value = `${annee}-${m}`;
        option.text = new Date(annee, m - 1, 1).toLocaleString('default', { month: 'long' });
        moisSelect.appendChild(option);
    });

    // Sélectionnez le mois actuel par défaut
    let moisActuel = new Date().toISOString().slice(0, 7);
    moisSelect.value = moisActuel;
}

remplirListeMois();
afficherDepenses();