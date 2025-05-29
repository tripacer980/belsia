document.addEventListener('DOMContentLoaded', () => {
    const arbreContainer = document.getElementById('arbreContainer');

    // Fonction pour charger les données JSON
    async function chargerDonneesArbre() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`Erreur de chargement des données : ${response.statusText}`);
            }
            const data = await response.json();
            // Supposons que le fichier JSON contient un tableau, on prend le premier élément comme racine
            if (data && data.length > 0) {
                genererArbre(data[0], arbreContainer);
            } else {
                console.error("Le fichier JSON est vide ou mal formaté.");
            }
        } catch (error) {
            console.error("Impossible de charger les données de l'arbre généalogique :", error);
            arbreContainer.innerHTML = "<p>Erreur lors du chargement de l'arbre généalogique.</p>";
        }
    }

    function genererArbre(data, container) {
        const generationDiv = document.createElement('div');
        generationDiv.classList.add('generation');

        const personneBoite = document.createElement('div');
        personneBoite.classList.add('personne-boite');

        const lienPersonne = document.createElement('a');
        lienPersonne.classList.add('lien-personne');
        lienPersonne.href = `#${data.id}`;
        lienPersonne.style.display = 'block';

        const nomPersonne = document.createElement('div');
        nomPersonne.classList.add('personne-info');
        nomPersonne.textContent = data.nom;

        const naissancePersonne = document.createElement('div');
        naissancePersonne.classList.add('personne-info');
        naissancePersonne.textContent = `Né(e) le ${data.naissance}`;

        lienPersonne.appendChild(nomPersonne);
        lienPersonne.appendChild(naissancePersonne);
        personneBoite.appendChild(lienPersonne);
        generationDiv.appendChild(personneBoite);

        // Ajout d'un ancrage pour le lien
        const ancrage = document.createElement('div');
        ancrage.id = data.id;
        ancrage.style.position = 'absolute';
        ancrage.style.top = '-50px';
        container.appendChild(ancrage); // L'ancrage est ajouté au container principal, pas à la generationDiv
        container.appendChild(generationDiv);


        if (data.enfants && data.enfants.length > 0) {
            const enfantsContainer = document.createElement('div');
            enfantsContainer.classList.add('generation');
            enfantsContainer.style.marginTop = '40px';

            if (data.enfants.length > 1) {
                const connecteurParentGauche = document.createElement('div');
                connecteurParentGauche.classList.add('connecteur-parent');
                personneBoite.appendChild(connecteurParentGauche);

                const connecteurParentDroit = document.createElement('div');
                connecteurParentDroit.classList.add('connecteur-enfant');
                personneBoite.appendChild(connecteurParentDroit);
            }

            data.enfants.forEach(enfant => {
                genererArbre(enfant, enfantsContainer);
            });
            container.appendChild(enfantsContainer);
        }
    }

    // Lancer le chargement des données quand le DOM est prêt
    chargerDonneesArbre();
});