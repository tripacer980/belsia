document.addEventListener('DOMContentLoaded', () => {
    const arbreContainer = document.getElementById('arbreContainer');

    async function chargerDonneesArbre() {
        try {
            // Assurez-vous que cette URL est correcte si vous utilisez GitHub Pages
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`Erreur de chargement des données : ${response.statusText}`);
            }
            const data = await response.json();
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

    // --- Fonction de rendu d'une personne individuelle ---
    function creerPersonneElement(personneData) {
        const divPersonne = document.createElement('div');
        divPersonne.classList.add('info-personne-unique');

        const lienPersonne = document.createElement('a');
        lienPersonne.classList.add('lien-personne');
        lienPersonne.href = `#${personneData.id}`;
        lienPersonne.style.display = 'block';

        if (personneData.photo) {
            const imgPersonne = document.createElement('img');
            imgPersonne.src = personneData.photo;
            imgPersonne.alt = personneData.nom;
            imgPersonne.classList.add('personne-photo');
            lienPersonne.appendChild(imgPersonne);
        }

        const nomDiv = document.createElement('div');
        nomDiv.classList.add('personne-nom');
        nomDiv.textContent = personneData.nom;
        lienPersonne.appendChild(nomDiv);

        const naissanceDecesDiv = document.createElement('div');
        naissanceDecesDiv.classList.add('personne-dates');
        let dates = `Né(e) le ${personneData.naissance}`;
        if (personneData.deces) {
            dates += ` - Décédé(e) le ${personneData.deces}`;
        }
        naissanceDecesDiv.textContent = dates;
        lienPersonne.appendChild(naissanceDecesDiv);

        if (personneData.description) {
            const descriptionDiv = document.createElement('div');
            descriptionDiv.classList.add('personne-description');
            descriptionDiv.textContent = personneData.description;
            lienPersonne.appendChild(descriptionDiv);
        }

        divPersonne.appendChild(lienPersonne);
        return divPersonne;
    }

    // --- Fonction principale de génération de l'arbre ---
    function genererArbre(nodeData, parentContainer) {
        if (!nodeData) return;

        const generationDiv = document.createElement('div');
        generationDiv.classList.add('generation');

        const personneBoite = document.createElement('div');
        personneBoite.classList.add('personne-boite');

        // Gérer le type de nœud (couple ou personne seule)
        if (nodeData.type === "couple") {
            personneBoite.classList.add('couple-boite');

            const epouxDiv = creerPersonneElement(nodeData.epoux);
            epouxDiv.classList.add('epoux');
            personneBoite.appendChild(epouxDiv);

            const epouseDiv = creerPersonneElement(nodeData.epouse);
            epouseDiv.classList.add('epouse');
            personneBoite.appendChild(epouseDiv);

            // Créer les ancrages pour les liens
            const ancrageEpoux = document.createElement('div');
            ancrageEpoux.id = nodeData.epoux.id;
            ancrageEpoux.classList.add('ancrage');
            parentContainer.appendChild(ancrageEpoux);

            const ancrageEpouse = document.createElement('div');
            ancrageEpouse.id = nodeData.epouse.id;
            ancrageEpouse.classList.add('ancrage');
            parentContainer.appendChild(ancrageEpouse);

        } else if (nodeData.type === "personne") {
            personneBoite.classList.add('personne-unique-boite');
            const personneSeuleDiv = creerPersonneElement(nodeData);
            personneBoite.appendChild(personneSeuleDiv);

            // Créer l'ancrage pour le lien
            const ancragePersonne = document.createElement('div');
            ancragePersonne.id = nodeData.id;
            ancragePersonne.classList.add('ancrage');
            parentContainer.appendChild(ancragePersonne);
        }

        generationDiv.appendChild(personneBoite);
        parentContainer.appendChild(generationDiv);

        // --- Gérer les enfants ---
        if (nodeData.enfants && nodeData.enfants.length > 0) {
            const enfantsContainer = document.createElement('div');
            enfantsContainer.classList.add('enfants-container'); // Nouveau conteneur pour les enfants
            enfantsContainer.style.marginTop = '40px'; // Espacement vertical

            // Ajout des connecteurs pour les parents
            const connecteurVerticalParent = document.createElement('div');
            connecteurVerticalParent.classList.add('connecteur-vertical-parent');
            personneBoite.appendChild(connecteurVerticalParent);

            // Ligne horizontale si plusieurs enfants
            if (nodeData.enfants.length > 1) {
                const connecteurHorizontal = document.createElement('div');
                connecteurHorizontal.classList.add('connecteur-horizontal-enfants');
                enfantsContainer.appendChild(connecteurHorizontal);
            }

            nodeData.enfants.forEach(enfant => {
                genererArbre(enfant, enfantsContainer); // Chaque enfant est généré dans le même enfantsContainer
            });

            // Une fois tous les enfants générés, ajuster la position des enfants
            // et ajouter le conteneur des enfants au parentContainer (qui est en fait la génération au-dessus)
            parentContainer.appendChild(enfantsContainer);
        }
    }

    chargerDonneesArbre();
});