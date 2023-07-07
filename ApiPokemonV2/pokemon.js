// Fonction pour récupérer les informations d'un Pokémon par son numéro
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

// Fonction pour récupérer les évolutions d'un Pokémon par son numéro
async function getEvolutionChain(pokemonNumber) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNumber}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        const evolutionChainUrl = data.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        if (evolutionChainResponse.ok) {
            const evolutionData = await evolutionChainResponse.json();
            const chain = evolutionData.chain;
            const evolutions = [];
            extractEvolutions(chain, evolutions);
            return evolutions;
        }
    }
    return null;
}

// Fonction pour récupérer les évolutions d'un Pokémon par son numéro
async function getEvolutionChain(pokemonNumber) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonNumber}`;
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        const evolutionChainUrl = data.evolution_chain.url;
        const evolutionChainResponse = await fetch(evolutionChainUrl);
        if (evolutionChainResponse.ok) {
            const evolutionData = await evolutionChainResponse.json();
            const chain = evolutionData.chain;
            const evolutions = [];
            extractEvolutions(chain, evolutions);
            return evolutions;
        }
    }
    return null;
}

// Fonction récursive pour extraire les évolutions dans l'ordre
function extractEvolutions(chain, evolutions) {
    const pokemonNumber = chain.species.url.split('/').slice(-2, -1)[0];
    evolutions.push(pokemonNumber);
    if (chain.evolves_to.length > 0) {
        for (const evolution of chain.evolves_to) {
            extractEvolutions(evolution, evolutions);
        }
    }
}


// Éléments du DOM
const pokemonForm = document.getElementById("pokemon-form");
const pokemonNumberInput = document.getElementById("pokemon-number");
const pokemonInfoContainer = document.getElementById("pokemon-info");
const pokemonName = document.getElementById("pokemon-name");
const pokemonWeight = document.getElementById("pokemon-weight");
const pokemonTypes = document.getElementById("pokemon-types");
const pokemonImage = document.getElementById("pokemon-image");
const evolutionInfoContainer = document.getElementById("evolution-info");
const evolutionList = document.getElementById("evolution-list");

// Gestionnaire de soumission du formulaire
pokemonForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const pokemonNumber = pokemonNumberInput.value;
    getPokemonInfo(pokemonNumber)
        .then((pokemonInfo) => {
            if (pokemonInfo) {
                const { name, weight, types, imageUrl } = pokemonInfo;

                // Affichage des informations du Pokémon
                pokemonName.textContent = `Nom: ${name}`;
                pokemonWeight.textContent = `Poids: ${weight}`;
                pokemonTypes.textContent = `Types: ${types.join(", ")}`;
                pokemonImage.src = imageUrl;

                // Récupération des évolutions du Pokémon
                getEvolutionChain(pokemonNumber).then((evolutionChain) => {
                    if (evolutionChain) {
                        // Affichage des évolutions
                        evolutionList.innerHTML = "";
                        evolutionChain.forEach((evolution) => {
                            getPokemonInfo(evolution).then((evolutionInfo) => {
                                if (evolutionInfo) {
                                    const {
                                        name: evolutionName,
                                        weight: evolutionWeight,
                                        types: evolutionTypes,
                                        imageUrl: evolutionImageUrl,
                                    } = evolutionInfo;

                                    const evolutionCard = document.createElement("div");
                                    evolutionCard.classList.add("evolution-card");
                                    evolutionCard.innerHTML = `
                    <h3>${evolutionName}</h3>
                    <p>Poids: ${evolutionWeight}</p>
                    <p>Types: ${evolutionTypes.join(", ")}</p>
                    <img src="${evolutionImageUrl}" alt="${evolutionName}">
                  `;
                                    evolutionList.appendChild(evolutionCard);
                                }
                            });
                        });

                        evolutionInfoContainer.classList.remove("hidden");
                    } else {
                        evolutionInfoContainer.classList.add("hidden");
                    }
                });

                pokemonInfoContainer.classList.remove("hidden");
            } else {
                pokemonInfoContainer.classList.add("hidden");
                evolutionInfoContainer.classList.add("hidden");
                alert("Aucun Pokémon trouvé avec ce numéro.");
            }
        })
        .catch((error) => console.error(error));
});

// Gestionnaire de clic du bouton "Voir tous les Pokémon"
const viewAllButton = document.getElementById("view-all-button");
viewAllButton.addEventListener("click", () => {
    window.location.href = "pokemon-list.html";
});
