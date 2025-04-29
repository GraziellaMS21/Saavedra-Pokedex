// DOM Elements
const modal = document.getElementById("pokemonModal");
const modalName = document.getElementById("modalPokemonName");
const modalSprite = document.getElementById("modalPokemonSprite");
const modalAttr = document.getElementById("modalPokemonAttr");
const modalDescription = document.getElementById("modalDescription");
const modalStats = document.getElementById("modalPokemonStats");
const closeBtn = document.getElementById("pokemonModalCloseBtn");
const pokemonNameInput = document.getElementById("fetchPokemonName");
const pokemonSprite = document.getElementById("pokemonSprite");
const pokemonNameDisplay = document.getElementById("pokemonNameDisplay");
const pokemonAttr = document.getElementById("pokemonAttr");
const description = document.getElementById("description");

// Top 5 Pokémon list
const top5Pokemons = ["piplup", "gardevoir", "lapras", "eevee", "ninetales"];

// Function to fetch a Pokémon from the search input
// Function to fetch a Pokémon from the search input
async function fetchPokemon() {
  const pokemonName = pokemonNameInput.value.toLowerCase().trim();
  
  if (!pokemonName) {
    alert("Please enter a Pokémon name");
    return;
  }
  
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
    if (!response.ok) throw new Error("Could not fetch Pokémon data");
    const data = await response.json();

    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
    if (!speciesResponse.ok) throw new Error("Could not fetch Pokémon species data");
    const speciesData = await speciesResponse.json();

    const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
    const descriptionText = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : "Description not available.";

    // Update the search card
    pokemonNameDisplay.textContent = data.name.toUpperCase();
    pokemonSprite.src = data.sprites.other["official-artwork"].front_default || data.sprites.front_default;
    
    // Create colored type badges
    let typesHTML = '';
    data.types.forEach(type => {
      const typeName = type.type.name;
      typesHTML += `<span class="type-badge ${typeName}">${typeName}</span>`;
    });
    pokemonAttr.innerHTML = typesHTML;
    
    description.textContent = descriptionText;
    
    // Set the data attribute for the card
    const searchCard = document.querySelector(".poke-card[onclick]");
    searchCard.dataset.pokemonName = pokemonName;
    
    // Show the search section
    document.getElementById("search").style.display = "block";
    document.getElementById("top5").style.display = "none";
    document.getElementById("all").style.display = "none";
    
  } catch (error) {
    console.error("Error fetching Pokémon:", error);
    alert("Could not find that Pokémon. Please check the spelling and try again.");
  }
}

// Generic function to show modal for any Pokémon
async function showPokemonModal(event) {
  // Get the Pokémon name from the clicked element's data attribute
  const name = event.currentTarget.dataset.pokemonName;

  if (!name) {
      console.error("No Pokémon name found in data attribute");
      return;
  }

  try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      if (!response.ok) throw new Error("Could not fetch Pokémon data");
      const data = await response.json();

      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      if (!speciesResponse.ok) throw new Error("Could not fetch Pokémon species data");
      const speciesData = await speciesResponse.json();

      const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      const descriptionText = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : "Description not available.";

      // Update modal content
      modalName.textContent = data.name.toUpperCase();
      modalSprite.src = data.sprites.other["dream_world"].front_default || data.sprites.front_shiny;

      modalPokemonId.textContent = `ID: ${data.id}`;
      modalPokemonHeight.textContent = `Height: ${data.height / 10} m`;
      modalPokemonWeight.textContent = `Weight: ${data.weight / 10} kg`;

      let abilitiesHTML = '';
      data.abilities.forEach(abilityInfo => {
          abilitiesHTML += `<span class="ability-badge">${abilityInfo.ability.name}</span>`;
      });
      modalPokemonAbilities.innerHTML = abilitiesHTML;
      modalPokemonAbilities.style.display = 'block'; // Ensure abilities are visible

      // Create colored type badges
      let typesHTML = '';
      data.types.forEach(type => {
          const typeName = type.type.name;
          typesHTML += `<span class="type-badge ${typeName}">${typeName}</span>`;
      });
      modalAttr.innerHTML = typesHTML;

      modalDescription.textContent = descriptionText;

      // Create stat bars
      let statsHTML = '<div class="stats-container">';
      data.stats.forEach(stat => {
          // Calculate bar width percentage (max stat value is typically 255)
          const percentage = Math.min(100, (stat.base_stat / 255) * 100);

          statsHTML += `
              <div class="stat-row">
                  <div class="stat-name">${stat.stat.name}</div>
                  <div class="stat-bar-container">
                      <div class="stat-bar" style="width: ${percentage}%;"></div>
                  </div>
                  <div class="stat-value">${stat.base_stat}</div>
              </div>
          `;
      });
      statsHTML += '</div>';

      modalStats.innerHTML = statsHTML;

      // Show the modal
      modal.style.display = "block";

  } catch (error) {
      console.error("Error fetching details:", error);
      alert("Could not display Pokémon details.");
  }
}


// Use the same modal function for top 5 Pokémon
const showTop5PokemonModal = showPokemonModal;

// Close modal when clicking the X
closeBtn.onclick = function() {
  modal.style.display = "none";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
  if (event.target == modal) {
      modal.style.display = "none";
  }
}

// Function to fetch and display top 5 Pokémon
// Function to fetch and display top 5 Pokémon
async function fetchTop5Pokemons() {
  const top5Container = document.querySelector("#top5 .row");
  top5Container.innerHTML = ""; // Clear existing cards

  for (const pokemonName of top5Pokemons) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      if (!response.ok) throw new Error(`Could not fetch ${pokemonName}`);
      const data = await response.json();

      const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
      if (!speciesResponse.ok) throw new Error(`Could not fetch species data for ${pokemonName}`);
      const speciesData = await speciesResponse.json();

      const flavorEntry = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en');
      const descriptionText = flavorEntry ? flavorEntry.flavor_text.replace(/\f/g, ' ') : "Description not available.";

      const card = document.createElement("div");
      card.classList.add("card", "poke-card", "col-md-3", "text-center", "p-2");
      card.onclick = showPokemonModal;
      card.style.cursor = "pointer";

      // Set the data-pokemon-name attribute
      card.dataset.pokemonName = pokemonName;

      // Create colored type badges
      let typesHTML = '';
      data.types.forEach(type => {
        const typeName = type.type.name;
        typesHTML += `<span class="type-badge ${typeName}">${typeName}</span>`;
      });

      card.innerHTML = `
        <img src="${data.sprites.other["official-artwork"].front_default}" alt="${pokemonName}" class="card-img-top sprite">
        <div class="card-body">
          <h5 class="card-title name">${data.name.toUpperCase()}</h5>
          <div class="type-container">${typesHTML}</div>
          <p class="desc">${descriptionText}</p>
        </div>
      `;

      top5Container.appendChild(card);

      // Add a small delay between requests to help prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 200));

    } catch (error) {
      console.error("Error fetching", pokemonName, ":", error);
      const errorCard = document.createElement("div");
      errorCard.classList.add("card", "poke-card", "col-md-3", "text-center", "p-2");
      errorCard.innerHTML = `<div class="card-body">Error loading ${pokemonName}</div>`;
      top5Container.appendChild(errorCard);
    }
  }
}

// Add event listener for the Enter key in the search box
pokemonNameInput.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchPokemon();
  }
});

// Immediately fetch Top 5 when page loads
window.addEventListener("DOMContentLoaded", fetchTop5Pokemons);

// Add the styles to the document
function addAllPokemonStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = allPokemonStyles;
  document.head.appendChild(styleElement);
}

// Function to load all Pokémon (paginated)
async function loadAllPokemon(offset = 0, limit = 20) {
  const allSection = document.getElementById("all");

  if (offset === 0 && !document.querySelector('.all-pokemon-grid')) {
    allSection.innerHTML = `
      <div class="container py-4">
        <h2 class="text-center mb-4">All Pokémon</h2>
        <div class="loading-spinner">
          <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="Loading...">
        </div>
        <div class="all-pokemon-grid"></div>
        <div class="pagination">
          <button id="prevPageBtn" disabled>Previous</button>
          <span id="pageIndicator">Page 1</span>
          <button id="nextPageBtn">Next</button>
        </div>
      </div>
    `;
  } else {
    const grid = document.querySelector('.all-pokemon-grid');
    if (grid) {
      grid.innerHTML = '';
    }
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'flex';
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
    if (!response.ok) throw new Error("Failed to fetch Pokémon list");
    const data = await response.json();

    const grid = document.querySelector('.all-pokemon-grid');

    for (const pokemon of data.results) {
      try {
        const pokemonResponse = await fetch(pokemon.url);
        if (!pokemonResponse.ok) throw new Error(`Failed to fetch ${pokemon.name}`);
        const pokemonData = await pokemonResponse.json();

        const card = document.createElement('div');
        card.className = 'all-pokemon-card';
        card.style.cursor = 'pointer';
        card.dataset.pokemonName = pokemon.name;
        card.onclick = showPokemonModal;

        const spriteUrl = pokemonData.sprites.other["official-artwork"].front_default ||
                          pokemonData.sprites.front_default;

        // Create colored type badges
        let typesHTML = '';
        pokemonData.types.forEach(type => {
          const typeName = type.type.name;
          typesHTML += `<span class="type-badge ${typeName}">${typeName}</span>`; // Apply type class
        });

        card.innerHTML = `
          <img src="${spriteUrl}" alt="${pokemon.name}" class="sprite">
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <div class="type-container">${typesHTML}</div>
          </div>
        `;

        grid.appendChild(card);

        await new Promise(resolve => setTimeout(resolve, 50));

      } catch (error) {
        console.error(`Error loading ${pokemon.name}:`, error);
        const errorCard = document.createElement('div');
        errorCard.className = 'all-pokemon-card';
        errorCard.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${pokemon.name}</h5>
            <p>Error loading data</p>
          </div>
        `;
        grid.appendChild(errorCard);
      }
    }

    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageIndicator = document.getElementById('pageIndicator');

    prevBtn.disabled = offset === 0;
    nextBtn.disabled = offset + limit >= 100;

    const currentPage = Math.floor(offset / limit) + 1;
    pageIndicator.textContent = `Page ${currentPage}`;

    prevBtn.onclick = () => {
      const newOffset = Math.max(0, offset - limit);
      loadAllPokemon(newOffset, limit);
    };

    nextBtn.onclick = () => {
      if (offset + limit < 100) {
        loadAllPokemon(offset + limit, limit);
      }
    };

  } catch (error) {
    console.error("Error loading Pokémon list:", error);
    const grid = document.querySelector('.all-pokemon-grid');
    if (grid) {
      grid.innerHTML = '<div class="text-center">Error loading Pokémon. Please try again later.</div>';
    }
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) loadingSpinner.style.display = 'none';
  }
}

// Add event listener for the All nav link to load Pokémon
document.getElementById('allNav').addEventListener('click', function() {
  // Check if we've already loaded the Pokémon
  const grid = document.querySelector('.all-pokemon-grid');
  if (!grid || grid.children.length === 0) {
    // First time clicking, load the Pokémon
    // Remove this line: addAllPokemonStyles();
    loadAllPokemon(0, 20); // Start with first 20
  }
});