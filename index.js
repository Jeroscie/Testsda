const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS for all routes

app.use(express.static('public'));

app.get('/api/popular/:pageNumber', async (req, res) => {
    try {
        const pageNumber = req.params.pageNumber;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/popular/${pageNumber}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching popular data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New route for fetching recent anime
app.get('/api/recent/:pageNumber', async (req, res) => {
    try {
        const pageNumber = req.params.pageNumber;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/recent/${pageNumber}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching recent anime data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/anime/:animeName', async (req, res) => {
    try {
        const animeName = req.params.animeName;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/anime/${animeName}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching anime data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/episode/:animeName/:episodeNumber', async (req, res) => {
    try {
        const animeName = req.params.animeName;
        const episodeNumber = req.params.episodeNumber;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/episode/${animeName}/${episodeNumber}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.header('Access-Control-Allow-Origin', '*');
        res.json(data);
    } catch (error) {
        console.error('Error fetching episode data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.query;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/search?query=${encodeURIComponent(query)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching search data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// New route for fetching upcoming anime
app.get('/api/upcoming/:pageNumber', async (req, res) => {
    try {
        const pageNumber = req.params.pageNumber;
        const apiUrl = `http://nl2-2.deploy.sbs:4350/api/upcoming/${pageNumber}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching upcoming anime data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
