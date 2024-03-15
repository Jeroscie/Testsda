//search.js
document.addEventListener("DOMContentLoaded", function() {
    function performSearch(query) {
        // Clear previous search results
        const searchResultsContainer = document.getElementById('search-results-container');
        searchResultsContainer.innerHTML = '';
    
        // Show loading bar
        const loaderBar = document.getElementById('loader-bar');
        loaderBar.style.display = 'block';
    
        fetch(`/api/search?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                // Hide loading bar after fetching search results
                loaderBar.style.display = 'none';
    
                if (data.results && data.results.length > 0) {
                    // Display "Search Results" heading
                    document.getElementById('search').style.display = 'block';
    
                    // Display search results
                    displaySearchResults(data.results);
                } else {
                    // Hide "Search Results" heading
                    document.getElementById('search').style.display = 'none';
    
                    // Display "No results found" message
                    displayNoResultsMessage(searchResultsContainer);
                }
            })
            .catch(error => {
                console.error('Error fetching search results:', error);
                // Hide loading bar in case of error
                loaderBar.style.display = 'none';
            });
    }
    

    // Function to display search results
    function displaySearchResults(results) {
        const searchResultsContainer = document.getElementById('search-results-container');
        results.forEach(anime => {
            const animeItem = document.createElement('div');
            animeItem.classList.add('anime-item');

            const title = document.createElement('p');
            title.textContent = anime.title;

            const image = document.createElement('img');
            image.src = anime.img;
            image.alt = anime.title;
            image.classList.add('anime-image');

            const link = document.createElement('a');
            link.href = '#'; // Set href to '#' temporarily

            // Add click event listener to navigate to episode page
            link.addEventListener('click', function() {
                const encodedAnimeName = encodeURIComponent(anime.title);
                window.location.href = `episode/episode.html?anime=${encodedAnimeName}`;
            });

            link.appendChild(image);

            animeItem.appendChild(link);
            animeItem.appendChild(title);
            searchResultsContainer.appendChild(animeItem);
        });
    }

    // Function to display "No results found" message
    function displayNoResultsMessage(container) {
        container.innerHTML = '';

        const noResultsMessage = document.createElement('p');
        noResultsMessage.textContent = 'No results found.';
        noResultsMessage.style.color = 'white'; // Make text white
        noResultsMessage.style.textAlign = 'center'; // Center align the text

        // Create a container to hold the message and center it vertically
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('message-container'); // Add class to the container
        messageContainer.appendChild(noResultsMessage);
        container.appendChild(messageContainer);
    }

    // Parse the query parameters to get the search query
    const params = new URLSearchParams(window.location.search);
    const query = params.get('query');

    // Display the search query in the search input field
    const searchInput = document.getElementById('search-input');
    searchInput.value = query || ''; // Set the value to the query if it exists, otherwise set it to an empty string

    // Add event listener for the search input field
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            const query = searchInput.value.trim();
            if (query !== '') {
                performSearch(query);
            }
        }
    });

    // Display the search results if the query exists
    if (query) {
        performSearch(query);
    }
});
