const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));
app.use(express.json());

const PORT = 5000;

// Test route
app.get("/", (req, res) => {
    res.send("Mood Song backend is working!");
});

// Get songs based on mood
app.get("/api/songs", async (req, res) => {
    try {
        const mood = req.query.mood || "happy";

        // Get number of songs from frontend
        let limit = parseInt(req.query.limit) || 10;

        // Keep limit between 1 and 20
        limit = Math.min(Math.max(limit, 1), 20);

        const url =
            `https://ws.audioscrobbler.com/2.0/` +
            `?method=tag.gettoptracks` +
            `&tag=${encodeURIComponent(mood)}` +
            `&api_key=${process.env.LASTFM_API_KEY}` +
            `&format=json` +
            `&limit=${limit}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Last.fm request failed");
        }

        const data = await response.json();

        // Last.fm can return an error inside a successful HTTP response
        if (data.error) {
            throw new Error(data.message || "Last.fm API error");
        }

        res.json(data);

    } catch (error) {
        console.error("API Error:", error.message);

        // Keep the response simple for frontend
        res.status(500).json({
            error: "Unable to get songs"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});