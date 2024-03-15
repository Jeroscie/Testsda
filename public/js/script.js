//script.js
let currentPage = 1;
const animeLimit = 14; // Set the limit to 9 anime per page
let currentSlide = 0;
let currentPageNumber = document.getElementById("currentPageNumber"); // Get the element reference
currentPageNumber.textContent = currentPage; // Set the initial current page number
const totalSlides = 4; // Assuming there are 5 recent anime items

document.addEventListener("DOMContentLoaded", function () {
    fetchAnime(currentPage);
    fetchRecentAnime();
    fetchUpcomingAnime();
});

//Search function
document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent default form submission behavior
            const query = searchInput.value.trim();
            if (query !== '') {
                searchAnime(query);
            }
        }
    });
});




function searchAnime(query) {
    // Show loading indicator
    const loader = document.getElementById('loader');
    loader.style.display = 'block';



    const encodedQuery = encodeURIComponent(query);
    fetch(`/api/search?query=${encodedQuery}`)
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator after fetching search results
            loader.style.display = 'none';

            // Redirect to the search results page with the search results
            const searchParams = new URLSearchParams();
            searchParams.append('query', query);
            searchParams.append('results', JSON.stringify(data.results));
            window.location.href = `search.html?${searchParams.toString()}`;
        })
        .catch(error => {
            // Hide loading indicator in case of error
            loader.style.display = 'none';

            console.error('Error fetching search results:', error);
            // Display error alert
            alert('Error fetching search results. Please try again later.');
        });
}


//popular function
function fetchAnime(pageNumber) {
    document.querySelector('.popular-text').style.display = 'none';
document.querySelector('.upcoming-text').style.display = 'none';
document.querySelector('.recent-text').style.display = 'none';
    const loader = document.getElementById('loader');
    loader.style.display = 'block'; // Show loader

    const animeContainer = document.getElementById('anime-container');
    animeContainer.innerHTML = ''; // Clear previous anime items

    // Show loader only for the popular anime section
    loader.style.display = 'block';

    fetch(`/api/popular/${pageNumber}`)
        .then(response => response.json())
        .then(data => {
            let animeCount = 0; // Initialize a counter for the number of anime items added
            data.results.forEach(anime => {
                if (animeCount < animeLimit) { // Check if the limit has been reached
                    const animeItem = document.createElement('div');
                    animeItem.classList.add('anime-item');

                    const title = document.createElement('p');
                    title.textContent = `Name: ${anime.title} \n`;

                    const releaseDate = document.createElement('p'); // Create a new paragraph element for the release date
                    releaseDate.textContent = ` Release Date: ${anime.releaseDate}`; // Set the text content to the release date

                    const image = document.createElement('img');
                    image.src = anime.image;
                    image.alt = anime.title;
                    image.classList.add('anime-image');

                    const link = document.createElement('a');
                    link.href = '#'; // Set href to '#' temporarily
                    link.addEventListener('click', function () {
                        viewEpisodes(anime.title); // Call function to view episodes
                    });

                    link.appendChild(image);

                    animeItem.appendChild(link);
                    animeItem.appendChild(title);
                    animeItem.appendChild(releaseDate); // Append the release date to the anime item
                    animeContainer.appendChild(animeItem);

                    animeCount++; // Increment the counter
                } else {
                    return; // Exit the loop if the limit has been reached
                }
            });

            loader.style.display = 'none'; // Hide loader after fetching and rendering data
            document.querySelector('.popular-text').style.display = 'block';
document.querySelector('.upcoming-text').style.display = 'block';
document.querySelector('.recent-text').style.display = 'block';

        })
        .catch(error => {
            console.error('Error fetching data:', error);
            loader.style.display = 'none'; // Hide loader in case of error
        });

    const animeTitles = document.querySelectorAll('.anime-title');
    animeTitles.forEach(title => {
        title.style.color = '#fff'; // Change color to white
    });

    // Update the current page number after fetching anime data
    currentPageNumber.textContent = currentPage;
}

function fetchRecentAnime() {
    const recentAnimeContainer = document.querySelector('.recent-anime-container');
    let currentPage = 1;

    function fetchData(page) {
        fetch(`/api/recent/${page}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(anime => {
                    const recentAnimeItem = document.createElement('div');
                    recentAnimeItem.classList.add('recent-anime-item');

                    const image = document.createElement('img');
                    image.src = anime.image;
                    image.alt = anime.title;

                    const title = document.createElement('p');
                    title.textContent = `${anime.title} - Episode ${anime.episode}`; // Include episode number

                    recentAnimeItem.appendChild(image);
                    recentAnimeItem.appendChild(title);

                    recentAnimeContainer.appendChild(recentAnimeItem);
                });
            })
            .catch(error => console.error('Error fetching recent anime:', error));
    }

    fetchData(currentPage);

    // Add event listener for scroll events
    recentAnimeContainer.addEventListener('scroll', () => {
        if (recentAnimeContainer.scrollLeft + recentAnimeContainer.clientWidth >= recentAnimeContainer.scrollWidth) {
            // If scrolled to the end, load data for the next page
            currentPage++;
            fetchData(currentPage);
        }
    });

    // Function to check if the device is a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
}


function enableSwipe(containerSelector) {
    const container = document.querySelector(containerSelector);
    let startX, startY, distX, distY;
    let threshold = 50; // Minimum distance required for a swipe to register

    container.addEventListener('touchstart', e => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
    });

    container.addEventListener('touchmove', e => {
        if (!startX || !startY) return;

        const touch = e.touches[0];
        distX = touch.clientX - startX;
        distY = touch.clientY - startY;

        if (Math.abs(distX) > threshold && Math.abs(distX) > Math.abs(distY)) {
            e.preventDefault(); // Prevent vertical scroll when swiping horizontally
        } else {
            startX = null;
            startY = null;
            distX = 0;
            distY = 0;
        }
    });

    container.addEventListener('touchend', e => {
        if (!startX || !startY) return;

        if (Math.abs(distX) > threshold && Math.abs(distX) > Math.abs(distY)) {
            if (distX > 0) {
                // Swipe right
                previousSlide();
            } else {
                // Swipe left
                nextSlide();
            }
        } else {
            // Handle click event when swipe is not detected
            const targetElement = e.changedTouches[0].target;
            if (targetElement.tagName === 'IMG') {
                // Clicked on an image, navigate to episode page
                const animeTitle = targetElement.alt;
                viewEpisodes(animeTitle);
            }
        }

        startX = null;
        startY = null;
        distX = 0;
        distY = 0;
    });
}


// Call fetchRecentAnime to initialize recent anime section
fetchRecentAnime();


function showSlide(slideIndex) {
    const slideContainer = document.getElementById('slide');
    slideContainer.style.transform = `translateX(-${slideIndex * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function previousSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

function nextPage() {
    currentPage++;
    fetchAnime(currentPage);
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchAnime(currentPage);
    } 
}

function viewEpisodes(animeName) {
    // Encode anime name to handle special characters
    const encodedAnimeName = encodeURIComponent(animeName);
    window.location.href = `episode/episode.html?anime=${encodedAnimeName}`; // Redirect to episode page
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
function fetchUpcomingAnime() {
    const upcomingContainer = document.getElementById('upcoming-anime-container');
    let currentPage = 1;

    function fetchData(page) {
        fetch(`/api/upcoming/${page}`)
            .then(response => response.json())
            .then(data => {
                data.results.forEach(anime => {
                    const upcomingItem = document.createElement('div');
                    upcomingItem.classList.add('upcoming-anime-item');

                    // Create elements for anime details
                    const image = document.createElement('img');
                    image.src = anime.media.coverImage.extraLarge;
                    image.alt = anime.media.title.userPreferred;

                    const title = document.createElement('p');
                    title.textContent = anime.media.title.userPreferred.length > 30 ? anime.media.title.userPreferred.slice(0, 30) + '...' : anime.media.title.userPreferred;
                    title.style.display = 'flex';
                    title.style.alignItems = 'center';

                    const airingDate = document.createElement('p');
                    airingDate.textContent = `Date: ${new Date(anime.airingAt * 1000).toLocaleDateString()}`;

                    const genres = document.createElement('p');
                    genres.textContent = anime.media.genres.length > 0 ? `Genre: ${anime.media.genres[0]}` : 'Genre: Not specified';

                    upcomingItem.appendChild(image);
                    upcomingItem.appendChild(title);
                    upcomingItem.appendChild(airingDate);
                    upcomingItem.appendChild(genres);

                    upcomingContainer.appendChild(upcomingItem);
                });
            })
            .catch(error => console.error('Error fetching upcoming anime:', error));
    }

    fetchData(currentPage);

     // Add event listener for scroll events
     upcomingContainer.addEventListener('scroll', () => {
        if (upcomingContainer.scrollLeft + upcomingContainer.clientWidth >= upcomingContainer.scrollWidth) {
            // If scrolled to the end, load data for the next page
            currentPage++;
            fetchData(currentPage);
        }
    });

    // Add event listeners for scroll and touchend events
    upcomingContainer.addEventListener('scroll', () => {
        if (isMobileDevice() && upcomingContainer.scrollLeft + upcomingContainer.clientWidth >= upcomingContainer.scrollWidth) {
            // Load more data when scrolled to the end on mobile devices
            currentPage++;
            fetchData(currentPage);
        }
    });

    upcomingContainer.addEventListener('touchend', () => {
        if (isMobileDevice() && upcomingContainer.scrollLeft + upcomingContainer.clientWidth >= upcomingContainer.scrollWidth) {
            // Load more data when touched at the end on mobile devices
            currentPage++;
            fetchData(currentPage);
        }
    });

    // Function to check if the device is a mobile device
    function isMobileDevice() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }
}


// Call fetchUpcomingAnime to initialize the infinite scrolling
fetchUpcomingAnime();
