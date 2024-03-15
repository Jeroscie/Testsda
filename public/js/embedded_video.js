document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const title = params.get('title');
    const episode = params.get('episode');

    if (title && episode) {
        fetchVideoUrl(title, episode);
        fetchAnimeEpisodes(title);
    } else {
        console.error('Title or episode not provided.');
    }
});

function fetchVideoUrl(title, episode) {
    const episodeNumber = episode.split('-').pop(); // Extracting the episode number from the provided string
    const episodeTitle = episode.replace(/-episode-/, '/');
    const apiUrl = `/api/episode/${encodeURIComponent(episodeTitle)}`.replace(/%2F/g, '/');
    console.log('Video API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Video API Response:', data);

            const videoContainer = document.getElementById('video-container');
            videoContainer.innerHTML = '';

            const video = document.createElement('video');
            video.controls = true;

            // Check if HLS.js is supported
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(data.results.stream.sources[0].file);
                hls.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari, use native HLS support
                video.src = data.results.stream.sources[0].file;
            } else {
                console.error('HLS.js is not supported, and native HLS playback is not available.');
            }

            videoContainer.appendChild(video);

           // Create and append anime title with episode number
           const animeTitle = document.createElement('h1');
           animeTitle.textContent = `${title} Episode ${episodeNumber}`;
           animeTitle.style.color = 'white';
           videoContainer.appendChild(animeTitle);
        })
        .catch(error => console.error('Error fetching video:', error));
}

function fetchAnimeEpisodes(title) {
    const apiUrl = `/api/anime/${encodeURIComponent(title)}`;
    console.log('Anime API URL:', apiUrl);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Anime API Response:', data);

            const episodesContainer = document.getElementById('episodes-container');
            episodesContainer.innerHTML = '';
             // Add plot summary
const plotSummary = document.createElement('p');
const maxLength = 500; // Maximum number of characters for plot summary
plotSummary.textContent = `Plot Summary: ${truncateText(data.results.plot_summary, maxLength)}`;
plotSummary.style.color = 'white';
plotSummary.style.marginBottom = '20px';
episodesContainer.appendChild(plotSummary);

// Function to truncate text
function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}


             
             // Add genre
             const genre = document.createElement('p');
             genre.textContent = `Genre: ${data.results.genre}`;
             genre.style.color = 'white';

             episodesContainer.appendChild(genre);

             // Add release date
            const releaseDate = document.createElement('p');
            releaseDate.textContent = `Release Date: ${data.results.released}`;
            releaseDate.style.color = 'white';
            episodesContainer.appendChild(releaseDate);

            // Add type
            const type = document.createElement('p');
            type.textContent = `Type: ${data.results.type}`;
            type.style.color = 'white';
            episodesContainer.appendChild(type);

            // Add status
            const status = document.createElement('p');
            status.textContent = `Status: ${data.results.status}`;
            status.style.color = 'white';
            episodesContainer.appendChild(status);

            // Add source
            const source = document.createElement('p');
            source.textContent = `Source: ${data.results.source}`;
            source.style.color = 'white';
  
            genre.appendChild(source);
 

            const episodesHeader = document.createElement('h2');
            episodesHeader.textContent = 'Episodes';
            episodesHeader.style.color = 'white';
            episodesHeader.style.marginBottom = '10px';
            episodesHeader.style.marginTop = '10px';
            episodesContainer.appendChild(episodesHeader);

            const episodesList = document.createElement('ul');
            data.results.episodes.forEach(episode => {
                const episodeItem = document.createElement('li');
                const episodeLink = document.createElement('a');
                episodeLink.textContent = `Ep: ${episode[0]}`;
                episodeLink.href = `/embedded/embedded_video.html?title=${encodeURIComponent(data.results.name)}&episode=${encodeURIComponent(episode[1])}`;
                episodeItem.appendChild(episodeLink);
                episodesList.appendChild(episodeItem);
            });
            episodesContainer.appendChild(episodesList);

            
        })
        .catch(error => console.error('Error fetching anime episodes:', error));
}

