document.addEventListener("DOMContentLoaded", function() {
    const searchForm = document.querySelector('form'); // Get the search form element
    const searchInput = document.getElementById('search-input'); // Get the search input field
    const params = new URLSearchParams(window.location.search);
    const animeName = params.get('anime');

    if (animeName) {
        fetchEpisodes(animeName);
    } else {
        console.error('Anime name not provided.');
    }

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior
    
        const query = searchInput.value.trim(); // Get the search query from the input field
    
        if (query) {
            // Redirect to search.html with the search query as a query parameter
            window.location.href = `/search.html?query=${encodeURIComponent(query)}`;
        } else {
            console.error('Search query is empty.');
        }
    });

    // Pre-fill the search input field if the query parameter is present
    const queryParam = params.get('query');
    if (queryParam) {
        searchInput.value = decodeURIComponent(queryParam);
    }
});

function fetchEpisodes(animeName) {
    fetch(`/api/anime/${animeName}`)
        .then(response => response.json())
        .then(data => {
            console.log('Anime API Response:', data);

            const episodeContainer = document.getElementById('episode-container');
            episodeContainer.innerHTML = '';

            const animeImage = document.createElement('img');
            animeImage.src = data.results.image;
            animeImage.alt = data.results.name;
            animeImage.classList.add('anime-image');
            episodeContainer.appendChild(animeImage);

            const animeTitle = document.createElement('h2');
            animeTitle.textContent = data.results.name;
            episodeContainer.appendChild(animeTitle);

            // Add plot summary
            const plotSummary = document.createElement('p');
            const maxLength = 2000; // Maximum number of characters for plot summary
            plotSummary.textContent = `Plot Summary: ${truncateText(data.results.plot_summary, maxLength)}`;
            plotSummary.style.color = 'white'; // Set the text color to white
            plotSummary.style.marginBottom = '20px';
            episodeContainer.appendChild(plotSummary);

            // Add genre
            const genre = document.createElement('p');
            genre.textContent = `Genre: ${data.results.genre}`;
            genre.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(genre);

            // Add release date
            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Release Date: ${data.results.released}`;
            releaseDate.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(releaseDate);

            // Add type
            const type = document.createElement('p');
            type.textContent = `Type: ${data.results.type}`;
            type.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(type);

            // Add status
            const status = document.createElement('p');
            status.textContent = `Status: ${data.results.status}`;
            status.style.color = 'white'; // Set the text color to white
            episodeContainer.appendChild(status);

            // Add source
            const source = document.createElement('p');
            source.textContent = `Source: ${data.results.source}`;
            source.style.color = 'white'; // Set the text color to white
            source.style.marginBottom = '15px';
            episodeContainer.appendChild(source);

            const episodesList = document.createElement('ul');
            data.results.episodes.forEach(episode => {
                const episodeItem = document.createElement('li');
                const episodeLink = document.createElement('a');
                episodeLink.textContent = `Ep: ${episode[0]}`;
                episodeLink.href = `/embedded/embedded_video.html?title=${encodeURIComponent(data.results.name)}&episode=${encodeURIComponent(episode[1])}`; // Pass episode title instead of anime name
                episodeItem.appendChild(episodeLink);
                episodesList.appendChild(episodeItem);
            });
            episodeContainer.appendChild(episodesList);
        })
        .catch(error => console.error('Error fetching episodes:', error));
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}


const menuBtn = document.querySelector(".menu-icon span");
const searchBtn = document.querySelector(".search-icon");
const cancelBtn = document.querySelector(".cancel-icon");
const items = document.querySelector(".nav-items");
const form = document.querySelector("form");
const body = document.body; // Reference to the body element


menuBtn.onclick = () => {
  items.classList.add("active");
  menuBtn.classList.add("hide");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
  body.classList.add("nav-active"); // Add class to body to prevent scrolling
}

cancelBtn.onclick = () => {
  items.classList.remove("active");
  menuBtn.classList.remove("hide");
  searchBtn.classList.remove("hide");
  cancelBtn.classList.remove("show");
  form.classList.remove("active");
  cancelBtn.style.color = "#ff3d00";
  body.classList.remove("nav-active"); // Remove class from body to enable scrolling
}

searchBtn.onclick = () => {
  form.classList.add("active");
  searchBtn.classList.add("hide");
  cancelBtn.classList.add("show");
  body.classList.add("nav-active"); // Add class to body to prevent scrolling
}