// ==========================================
// VibeTune - Frontend JavaScript
// ==========================================

const API_URL = "http://localhost:5000";

// ==========================================
// GET HTML ELEMENTS
// ==========================================

const situationInput = document.getElementById("situationInput");
const characterCount = document.getElementById("characterCount");

const countButtons = document.querySelectorAll(".count-btn");
const findMusicBtn = document.getElementById("findMusicBtn");

const analysisSection = document.getElementById("analysisSection");
const recommendationsSection =
    document.getElementById("recommendationsSection");

const loading = document.getElementById("loading");

const moodResult = document.getElementById("moodResult");
const energyResult = document.getElementById("energyResult");
const contextResult = document.getElementById("contextResult");
const socialResult = document.getElementById("socialResult");

const songsContainer = document.getElementById("songsContainer");
const recommendationCount =
    document.getElementById("recommendationCount");

const recommendationDescription =
    document.getElementById("recommendationDescription");

const historyBtn = document.getElementById("historyBtn");
const historySection = document.getElementById("historySection");
const historyContainer = document.getElementById("historyContainer");


// ==========================================
// VARIABLES
// ==========================================

// Default = 10 songs
let selectedSongCount = 10;


// ==========================================
// CHARACTER COUNTER
// ==========================================

situationInput.addEventListener("input", () => {

    const length = situationInput.value.length;

    characterCount.textContent = `${length} / 500`;

});


// ==========================================
// SONG COUNT SELECTION
// ==========================================

countButtons.forEach(button => {

    button.addEventListener("click", () => {

        // Remove active from all buttons
        countButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        // Add active to clicked button
        button.classList.add("active");

        // Save selected number
        selectedSongCount = Number(button.dataset.count);

        console.log(
            "Selected songs:",
            selectedSongCount
        );

    });

});


// ==========================================
// UNDERSTAND MY VIBE
// ==========================================

findMusicBtn.addEventListener("click", async () => {

    const text = situationInput.value.trim();

    // --------------------------------------
    // CHECK INPUT
    // --------------------------------------

    if (!text) {

        situationInput.focus();

        return;

    }


    // --------------------------------------
    // RESET OLD RESULTS
    // --------------------------------------

    analysisSection.classList.add("hidden");
    recommendationsSection.classList.add("hidden");

    songsContainer.innerHTML = "";

    // --------------------------------------
    // SHOW LOADING
    // --------------------------------------

    showLoading();


    try {

        // ==================================
        // STEP 1 - ANALYZE VIBE
        // ==================================

        const analysis = analyzeVibe(text);

        console.log("Vibe analysis:", analysis);


        // Show analysis
        displayAnalysis(analysis);


        // ==================================
        // STEP 2 - GET SONGS
        // ==================================

        const songs = await getSongs(
            analysis,
            selectedSongCount
        );

        console.log("Songs received:", songs);


        // ==================================
        // STEP 3 - DISPLAY SONGS
        // ==================================

        if (songs.length > 0) {

            displaySongs(
                songs,
                analysis
            );

        } else {

            showEmptyMessage();

        }


        // ==================================
        // STEP 4 - SAVE USER SESSION
        // ==================================

        saveHistory({

            text: text,

            mood: analysis.mood,

            energy: analysis.energy,

            context: analysis.context,

            social: analysis.social,

            songCount: songs.length,

            date: new Date().toLocaleString()

        });


    } catch (error) {

        // Technical error goes ONLY to console
        console.error(
            "VibeTune error:",
            error
        );

        // User does NOT see technical error
        showEmptyMessage();

    }


    // ==================================
    // FINISH
    // ==================================

    hideLoading();

    recommendationsSection.scrollIntoView({
        behavior: "smooth"
    });

});


// ==========================================
// VIBE ANALYSIS
// ==========================================

function analyzeVibe(text) {

    const input = text.toLowerCase();

    let mood = "Neutral";
    let moodTag = "pop";

    // ======================================
    // HAPPY
    // ======================================

    if (
        containsAny(input, [
            "happy",
            "excited",
            "joy",
            "great",
            "amazing",
            "fun",
            "celebrate",
            "celebration",
            "good",
            "wonderful",
            "cheerful",
            "positive",
            "enjoy",
            "enjoyed",
            "glad"
        ])
    ) {

        mood = "Happy";
        moodTag = "happy";

    }

    // ======================================
    // SAD
    // ======================================

    else if (
        containsAny(input, [
            "sad",
            "depressed",
            "cry",
            "crying",
            "heartbroken",
            "lonely",
            "upset",
            "miss",
            "unhappy",
            "down",
            "hurt"
        ])
    ) {

        mood = "Sad";
        moodTag = "sad";

    }

    // ======================================
    // ANGRY
    // ======================================

    else if (
        containsAny(input, [
            "angry",
            "mad",
            "furious",
            "annoyed",
            "frustrated",
            "hate",
            "irritated",
            "rage"
        ])
    ) {

        mood = "Angry";
        moodTag = "angry";

    }

    // ======================================
    // RELAXED
    // ======================================

    else if (
        containsAny(input, [
            "relaxed",
            "calm",
            "peaceful",
            "chill",
            "peace",
            "rest",
            "comfortable",
            "quiet",
            "relax"
        ])
    ) {

        mood = "Relaxed";
        moodTag = "chill";

    }

    // ======================================
    // ROMANTIC
    // ======================================

    else if (
        containsAny(input, [
            "romantic",
            "crush",
            "date",
            "relationship",
            "romance",
            "girlfriend",
            "boyfriend",
            "love"
        ])
    ) {

        mood = "Romantic";
        moodTag = "romantic";

    }


    // ======================================
    // ENERGY
    // ======================================

    let energy = "Medium";

    if (
        containsAny(input, [
            "excited",
            "energetic",
            "hyped",
            "party",
            "dance",
            "dancing",
            "running",
            "workout",
            "gym",
            "active",
            "crazy",
            "powerful",
            "celebrate"
        ])
    ) {

        energy = "High";

    }

    else if (
        containsAny(input, [
            "tired",
            "exhausted",
            "sleepy",
            "calm",
            "relaxed",
            "peaceful",
            "slow",
            "rest",
            "quiet"
        ])
    ) {

        energy = "Low";

    }


    // ======================================
    // CONTEXT
    // ======================================

    let context = "Everyday";

    if (
        containsAny(input, [
            "exam",
            "exams",
            "test",
            "study",
            "studying",
            "college",
            "class",
            "assignment"
        ])
    ) {

        context = "Study / College";

    }

    else if (
        containsAny(input, [
            "party",
            "celebrate",
            "celebration",
            "birthday",
            "festival"
        ])
    ) {

        context = "Celebration";

    }

    else if (
        containsAny(input, [
            "workout",
            "gym",
            "running",
            "exercise",
            "training"
        ])
    ) {

        context = "Workout";

    }

    else if (
        containsAny(input, [
            "drive",
            "driving",
            "road",
            "trip",
            "travel",
            "journey"
        ])
    ) {

        context = "Travel";

    }

    else if (
        containsAny(input, [
            "sleep",
            "bed",
            "night",
            "sleepy"
        ])
    ) {

        context = "Night / Relaxation";

    }


    // ======================================
    // SOCIAL
    // ======================================

    let social = "No";

    if (
        containsAny(input, [
            "friends",
            "friend",
            "family",
            "people",
            "everyone",
            "party",
            "together",
            "group",
            "with my"
        ])
    ) {

        social = "Yes";

    }


    return {

        mood,
        moodTag,
        energy,
        context,
        social

    };

}


// ==========================================
// CHECK KEYWORDS
// ==========================================

function containsAny(text, keywords) {

    return keywords.some(keyword =>
        text.includes(keyword)
    );

}


// ==========================================
// DISPLAY ANALYSIS
// ==========================================

function displayAnalysis(analysis) {

    moodResult.textContent = analysis.mood;

    energyResult.textContent = analysis.energy;

    contextResult.textContent = analysis.context;

    socialResult.textContent = analysis.social;

    analysisSection.classList.remove("hidden");

}


// ==========================================
// GET SONGS FROM BACKEND
// ==========================================

async function getSongs(analysis, count) {

    // Use mood as the main Last.fm tag
    const mood = analysis.moodTag;

    const url =
        `${API_URL}/api/songs` +
        `?mood=${encodeURIComponent(mood)}` +
        `&limit=${count}`;

    console.log("Requesting:", url);


    const response = await fetch(url);


    if (!response.ok) {

        throw new Error(
            `Backend returned ${response.status}`
        );

    }


    const data = await response.json();

    console.log("Backend response:", data);


    // Check Last.fm response
    if (
        !data ||
        !data.tracks ||
        !data.tracks.track
    ) {

        return [];

    }


    let tracks = data.tracks.track;


    // Last.fm may return one object instead of array
    if (!Array.isArray(tracks)) {

        tracks = [tracks];

    }


    // Make sure we don't display more than requested
    return tracks.slice(0, count);

}


// ==========================================
// DISPLAY SONGS
// ==========================================

function displaySongs(songs, analysis) {

    songsContainer.innerHTML = "";


    recommendationCount.textContent =
        `${songs.length} songs`;


    recommendationDescription.textContent =
        `Based on your ${analysis.mood.toLowerCase()} mood and ${analysis.energy.toLowerCase()} energy.`;


    recommendationsSection.classList.remove(
        "hidden"
    );


    songs.forEach((song, index) => {

        const songCard =
            document.createElement("div");

        songCard.className = "song-card";


        // ==================================
        // IMAGE
        // ==================================

        let imageURL = "";

        if (
            song.image &&
            song.image.length > 0
        ) {

            const image =
                song.image.find(
                    img => img.size === "large"
                ) ||
                song.image[
                    song.image.length - 1
                ];

            if (
                image &&
                image["#text"]
            ) {

                imageURL =
                    image["#text"];

            }

        }


        // Fallback image
        if (!imageURL) {

            imageURL =
                "https://via.placeholder.com/80?text=Music";

        }


        // ==================================
        // ARTIST
        // ==================================

        const artistName =
            song.artist?.name ||
            "Unknown Artist";


        // ==================================
        // SONG URL
        // ==================================

        const songURL =
            song.url || "#";


        // ==================================
        // CARD
        // ==================================

        songCard.innerHTML = `

            <div class="song-number">
                ${index + 1}
            </div>

            <img
                class="song-image"
                src="${imageURL}"
                alt="${escapeHTML(song.name)}"
            >

            <div class="song-info">

                <h3>
                    ${escapeHTML(song.name)}
                </h3>

                <p>
                    ${escapeHTML(artistName)}
                </p>

            </div>

            <div class="song-actions">

                <button
                    class="like-btn"
                    title="Like"
                >
                    ♡
                </button>

                <button
                    class="skip-btn"
                    title="Skip"
                >
                    ⏭
                </button>

                <a
                    class="play-btn"
                    href="${songURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    ▶ Play
                </a>

            </div>

        `;


        // ==================================
        // LIKE
        // ==================================

        const likeButton =
            songCard.querySelector(".like-btn");


        likeButton.addEventListener(
            "click",
            () => {

                likeButton.textContent = "♥";

                saveSongInteraction(
                    song,
                    "liked"
                );

            }
        );


        // ==================================
        // SKIP
        // ==================================

        const skipButton =
            songCard.querySelector(".skip-btn");


        skipButton.addEventListener(
            "click",
            () => {

                songCard.style.opacity = "0.4";

                saveSongInteraction(
                    song,
                    "skipped"
                );

            }
        );


        // ==================================
        // PLAY
        // ==================================

        const playButton =
            songCard.querySelector(".play-btn");


        playButton.addEventListener(
            "click",
            () => {

                saveSongInteraction(
                    song,
                    "played"
                );

            }
        );


        songsContainer.appendChild(
            songCard
        );

    });

}


// ==========================================
// EMPTY RESULT
// ==========================================

function showEmptyMessage() {

    recommendationCount.textContent = "0 songs";

    songsContainer.innerHTML = `

        <div class="empty-history">

            <h3>
                No songs found for this vibe.
            </h3>

            <p>
                Try describing your mood in a different way.
            </p>

        </div>

    `;

    recommendationsSection.classList.remove(
        "hidden"
    );

}


// ==========================================
// SAVE SONG INTERACTION
// ==========================================

function saveSongInteraction(song, action) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "vibeTuneInteractions"
            )
        ) || [];


    history.push({

        song: song.name,

        artist:
            song.artist?.name ||
            "Unknown",

        action: action,

        date:
            new Date().toLocaleString()

    });


    localStorage.setItem(
        "vibeTuneInteractions",
        JSON.stringify(history)
    );

}


// ==========================================
// SAVE VIBE HISTORY
// ==========================================

function saveHistory(session) {

    const history =
        JSON.parse(
            localStorage.getItem(
                "vibeTuneHistory"
            )
        ) || [];


    history.unshift(session);


    // Keep last 20 sessions
    const limitedHistory =
        history.slice(0, 20);


    localStorage.setItem(
        "vibeTuneHistory",
        JSON.stringify(limitedHistory)
    );

}


// ==========================================
// HISTORY BUTTON
// ==========================================

historyBtn.addEventListener(
    "click",
    () => {

        displayHistory();

        historySection.scrollIntoView({
            behavior: "smooth"
        });

    }
);


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    const history =
        JSON.parse(
            localStorage.getItem(
                "vibeTuneHistory"
            )
        ) || [];


    historyContainer.innerHTML = "";


    if (history.length === 0) {

        historyContainer.innerHTML = `

            <div class="empty-history">

                <h3>
                    No listening history yet
                </h3>

                <p>
                    Your vibe sessions will appear here.
                </p>

            </div>

        `;

        historySection.classList.remove(
            "hidden"
        );

        return;

    }


    history.forEach(item => {

        const historyCard =
            document.createElement("div");

        historyCard.className =
            "history-card";


        historyCard.innerHTML = `

            <div>

                <strong>
                    ${escapeHTML(item.mood)}
                </strong>

                <p>
                    ${escapeHTML(item.text)}
                </p>

            </div>

            <div>

                <span>
                    Energy:
                    ${escapeHTML(item.energy)}
                </span>

                <span>
                    ${item.songCount} songs
                </span>

                <small>
                    ${escapeHTML(item.date)}
                </small>

            </div>

        `;


        historyContainer.appendChild(
            historyCard
        );

    });


    historySection.classList.remove(
        "hidden"
    );

}


// ==========================================
// LOADING
// ==========================================

function showLoading() {

    loading.classList.remove("hidden");

    findMusicBtn.disabled = true;

    findMusicBtn.innerHTML =
        "Understanding your vibe...";

}


function hideLoading() {

    loading.classList.add("hidden");

    findMusicBtn.disabled = false;

    findMusicBtn.innerHTML =
        "<span>✦</span> Understand My Vibe";

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    if (!value) return "";

    return String(value)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}