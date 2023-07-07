// Constantes pour la pagination
const itemsPerPage = 25;
let currentPage = 1;

// Éléments du DOM
const pokemonListContainer = document.getElementById("pokemon-list");
const paginationContainer = document.getElementById("pagination");

// Fonction pour récupérer les informations de base d'un Pokémon par son numéro
async function getPokemonInfo(pokemonNumber) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonNumber}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        const name = data.name;
        const weight = data.weight;
        const types = data.types.map((type) => type.type.name);
        const imageUrl = data.sprites.front_default;
        return { name, weight, types, imageUrl };
    } else {
        return null;
    }
}

// Fonction pour générer la carte d'un Pokémon
function generatePokemonCard(pokemon) {
    const { number, name, weight, types, imageUrl } = pokemon;

    const pokemonCard = document.createElement("div");
    pokemonCard.classList.add("pokemon-card");

    const pokemonNumber = document.createElement("p");
    pokemonNumber.textContent = `Pokemon numéro : ${number}`;
    pokemonCard.appendChild(pokemonNumber);

    const pokemonName = document.createElement("h3");
    pokemonName.textContent = name;
    pokemonCard.appendChild(pokemonName);

    const pokemonInfo = document.createElement("p");
    pokemonInfo.textContent = `Nom: ${name}`;
    pokemonCard.appendChild(pokemonInfo);

    const pokemonWeight = document.createElement("p");
    pokemonWeight.textContent = `Poids: ${weight}`;
    pokemonCard.appendChild(pokemonWeight);

    const pokemonTypes = document.createElement("p");
    pokemonTypes.textContent = `Types: ${types.join(", ")}`;
    pokemonCard.appendChild(pokemonTypes);

    const pokemonImage = document.createElement("img");
    pokemonImage.src = imageUrl;
    pokemonImage.alt = name;
    pokemonCard.appendChild(pokemonImage);

    return pokemonCard;
}

// Fonction pour afficher les Pokémon d'une page spécifique
async function displayPokemonPage(page) {
    const start = (page - 1) * itemsPerPage;
    const end = page * itemsPerPage;
    const pokemonPage = pokemonList.slice(start, end);

    pokemonListContainer.innerHTML = "";

    for (const pokemonNumber of pokemonPage) {
        const pokemonInfo = await getPokemonInfo(pokemonNumber);
        if (pokemonInfo) {
            pokemonInfo.number = pokemonNumber; // Ajout du numéro du Pokémon à l'objet pokemonInfo
            const pokemonCard = generatePokemonCard(pokemonInfo);
            pokemonListContainer.appendChild(pokemonCard);
        }
    }
}

// Fonction pour générer les liens de pagination
function generatePaginationLinks() {
    paginationContainer.innerHTML = "";

    const numPages = Math.ceil(pokemonList.length / itemsPerPage);

    for (let i = 1; i <= numPages; i++) {
        const link = document.createElement("a");
        link.href = "#";
        link.textContent = i;
        link.classList.add("pagination-link");
        if (i === currentPage) {
            link.classList.add("active");
        }

        link.addEventListener("click", (event) => {
            event.preventDefault();
            const newPage = parseInt(event.target.textContent);
            if (newPage !== currentPage) {
                currentPage = newPage;
                displayPokemonPage(currentPage);
                updatePaginationLinks();
            }
        });

        paginationContainer.appendChild(link);

        // Ajouter un espace après chaque numéro de page, sauf pour le dernier
        if (i < numPages) {
            const space = document.createTextNode(" ");
            paginationContainer.appendChild(space);
        }
    }
}

// Fonction pour mettre à jour l'apparence des liens de pagination
function updatePaginationLinks() {
    const links = document.querySelectorAll(".pagination-link");

    links.forEach((link) => {
        link.classList.remove("active");
        if (parseInt(link.textContent) === currentPage) {
            link.classList.add("active");
        }
    });
}

// Chargement initial de la page
document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
    const data = await response.json();
    const results = data.results;

    pokemonList = results.map((pokemon) => {
        const urlParts = pokemon.url.split("/");
        return parseInt(urlParts[urlParts.length - 2]);
    });

    displayPokemonPage(currentPage);
    generatePaginationLinks();
});

// Élément du DOM
const backButton = document.getElementById("back-button");

// Écouteur d'événement pour le bouton de retour
backButton.addEventListener("click", () => {
    window.location.href = "pokemon.html";
});
