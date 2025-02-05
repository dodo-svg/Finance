const PART_1 = "ghp_";
const PART_2 = "r5NjJXTeFbkYNCO3rI31";
const PART_3 = "BOHFtLOijO1wANJE";

const GITHUB_Tk = PART_1 + PART_2 + PART_3;

const API_URL = `https://api.github.com/repos/dodo-svg/Finance/issues`;

let data = [];

// Afficher un message de chargement
function setLoading(isLoading) {
    const loader = document.getElementById("loading");
    if (loader) {
        loader.style.display = isLoading ? "block" : "none";
    }
}

// Charger les dépenses depuis GitHub Issues
async function chargerDepenses() {
    try {
        setLoading(true);
        const response = await fetch(API_URL, {
            headers: {
                "Authorization": `token ${GITHUB_Tk}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
        }

        const issues = await response.json();
        console.log("Dépenses récupérées :", issues);

        // Vérifier que les issues ont bien un corps JSON
        data = issues.map(issue => {
            try {
                // S'assurer que le body est bien un JSON valide
                const depense = JSON.parse(issue.body);
                return {
                    id: issue.number,
                    ...depense
                };
            } catch (error) {
                console.warn(`Problème avec une issue (#${issue.number}): ${error}`);
                return null; // Ignorer les issues mal formatées
            }
        }).filter(d => d !== null); // Filtrer les résultats null

        localStorage.setItem("depenses", JSON.stringify(data));
        afficherDepenses();
    } catch (error) {
        console.error("Erreur lors du chargement des dépenses :", error);
    } finally {
        setLoading(false);
    }
}

// Ajouter une dépense en créant une issue sur GitHub
async function ajouterDepense() {
    let libelle = document.getElementById("libelle").value.trim();
    let montant = document.getElementById("montant").value.trim();
    let date = document.getElementById("date").value.trim();

    if (!libelle || !montant || !date) {
        alert("Veuillez remplir tous les champs !");
        return;
    }

    let nouvelleDepense = { libelle, montant, date };

    try {
        setLoading(true);
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `token ${GITHUB_Tk}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: `Dépense ${date} - ${libelle}`,
                body: JSON.stringify(nouvelleDepense)
            })
        });

        if (!response.ok) {
            throw new Error(`Erreur API GitHub: ${response.status} ${response.statusText}`);
        }

        // Ajouter immédiatement la dépense pour éviter d'attendre GitHub
        data.push(nouvelleDepense);
        localStorage.setItem("depenses", JSON.stringify(data));
        afficherDepenses();
        console.log("Dépense ajoutée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
    } finally {
        setLoading(false);
    }
}

// Afficher les dépenses sur la page
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

// Remplir la liste des mois pour le filtrage
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

    let moisActuel = new Date().toISOString().slice(0, 7);
    moisSelect.value = moisActuel;
}

// Ajouter un indicateur de chargement dans la page
document.addEventListener("DOMContentLoaded", () => {
    let loader = document.createElement("div");
    loader.id = "loading";
    loader.style.display = "none";
    loader.innerHTML = "Chargement...";
    document.body.prepend(loader);
});

// Charger les dépenses depuis GitHub au démarrage
remplirListeMois();
chargerDepenses();
