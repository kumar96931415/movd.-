// DOM Elements
const songsGrid = document.getElementById('songsGrid');
const audioPlayer = new Audio();
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressBar = document.querySelector('.progress');
const progressArea = document.querySelector('.progress-bar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const languageButtons = document.querySelectorAll('.language-nav button');
const songImage = document.getElementById('songImage');
const songTitle = document.getElementById('songTitle');
const songArtist = document.getElementById('songArtist');

// State
let currentSongIndex = 0;
let songs = [];
let isPlaying = false;
let isShuffled = false;
let repeatMode = 'none'; // none, one, all
let currentLanguage = 'all';

// Sample songs data with real URLs
const sampleSongs = [
    {
        id: 1,
        title: "Lollipop Lagelu",
        artist: "Pawan Singh",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/Gr8G_ldltDE/maxresdefault.jpg",
        url: "Bada Kamaal Lagela Tor Laal Saari (Hit Matter)-BiharMasti.IN.mp3",
        downloadUrl: "Bada Kamaal Lagela Tor Laal Saari (Hit Matter)-BiharMasti.IN.mp3"
    },
    {
        id: 2,
        title: "Kesariya",
        artist: "Arijit Singh",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/BddP6PYo2gs/maxresdefault.jpg",
        url: "https://pwdown.info/14674/Kesariya%20-%20Brahmastra.mp3",
        downloadUrl: "https://pwdown.info/14674/Kesariya%20-%20Brahmastra.mp3"
    },
    {
        id: 3,
        title: "Brown Munde",
        artist: "AP Dhillon",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/VNs_cCtdbPc/maxresdefault.jpg",
        url: "Aaj Kaila Ta Bathata Daar Balamu (Hit Matter)-BiharMasti.IN.mp3",
        downloadUrl: "Aaj Kaila Ta Bathata Daar Balamu (Hit Matter)-BiharMasti.IN.mp3"
    },
    {
        id: 4,
        title: "52 Gaj Ka Daman",
        artist: "Renuka Panwar",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/hz7LQrDY19s/maxresdefault.jpg",
        url: "Abaki Yadav Ji Ke Jhanda Tohra Lahanga Pa Fahari (Hit Matter)-BiharMasti.IN.mp3",
        downloadUrl: "Abaki Yadav Ji Ke Jhanda Tohra Lahanga Pa Fahari (Hit Matter)-BiharMasti.IN.mp3"
    },
    {
        id: 5,
        title: "Paani Paani",
        artist: "Badshah & Aastha Gill",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/Q6c8X_s1h0Y/maxresdefault.jpg",
        url: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3",
        downloadUrl: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3"
    },
    {
        id: 6,
        title: "Paani Paani",
        artist: "Badshah & Aastha Gill",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/Q6c8X_s1h0Y/maxresdefault.jpg",
        url: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3",
        downloadUrl: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3"
    }
    {
        id: 6,
        title: "Paani Paani",
        artist: "Badshah & Aastha Gill",
        language: "bhojpuri",
        image: "https://i.ytimg.com/vi/Q6c8X_s1h0Y/maxresdefault.jpg",
        url: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3",
        downloadUrl: "128-Mere Mehboob Mere Sanam - Bad Newz 128 Kbps.mp3"
    }
];

// Function to get image URL with fallback
function getImageUrl(song) {
    // Try to load the image, if it fails, generate a colored placeholder
    return song.image;
}

// Generate consistent colors for each language
function getColorForLanguage(language) {
    const colors = {
        bhojpuri: 'e74c3c',    // Red
        hindi: '3498db',       // Blue
        punjabi: 'f1c40f',     // Yellow
        malayalam: '2ecc71',   // Green
        haryanvi: '9b59b6'     // Purple
    };
    return colors[language] || '95a5a6'; // Default gray
}

// Load songs into grid
function loadSongs() {
    songsGrid.innerHTML = '';
    const filteredSongs = songs.filter(song => 
        currentLanguage === 'all' || song.language === currentLanguage
    );

    filteredSongs.forEach((song, index) => {
        const card = document.createElement('div');
        card.className = 'song-card';
        card.innerHTML = `
            <img src="${getImageUrl(song)}" alt="${song.title}" loading="lazy">
            <div class="card-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <div class="card-actions">
                    <button class="play-btn" aria-label="Play"><i class="fas fa-play"></i></button>
                    <button class="download-btn" aria-label="Download" onclick="downloadSong(${index})">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
        card.querySelector('.play-btn').addEventListener('click', () => playSong(index));
        songsGrid.appendChild(card);
    });
}

// Update playSong function to handle real URLs
function playSong(index) {
    if (index >= 0 && index < songs.length) {
        currentSongIndex = index;
        const song = songs[currentSongIndex];
        
        // Update UI
        songImage.src = song.image;
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        
        // Play the song
        try {
            audioPlayer.src = song.url;
            audioPlayer.load();
            
            const playPromise = audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        isPlaying = true;
                        updatePlayButton();
                        showToast(`Now playing: ${song.title}`);
                    })
                    .catch(error => {
                        console.results('playing song:', results);
                        isPlaying = true;
                        updatePlayButton();
                        showToast('Error playing song. Please try another one.', true);
                    });
            }
        } catch (results) {
            console.results('Error setting up song:', results);
            showToast('Error playing song. Please try another one.', true);
        }
    }
}

// Update play button icon
function updatePlayButton() {
    const icon = playBtn.querySelector('i');
    icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
}

// Format time in minutes:seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update volume
function updateVolume() {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
    
    // Update volume icon based on level
    const volumeIcon = document.querySelector('.volume-control i');
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    
    // Remove any existing toast
    toast.classList.remove('show');
    
    // Force a reflow to restart the animation
    void toast.offsetWidth;
    
    toast.textContent = message;
    toast.className = 'toast' + (isError ? ' error' : '');
    
    // Show the new toast
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-hide after duration
    const duration = isError ? 5000 : 3000;
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Search songs using API
async function searchSongs() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    try {
        // Filter existing songs based on the search query
        const searchResults = sampleSongs.filter(song => 
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.language.toLowerCase().includes(query)
        );

        if (searchResults.length === 0) {
            showToast('No songs found matching your search.', true);
            return;
        }

        songs = searchResults;
        loadSongs();
        showToast(`Found ${searchResults.length} songs`);
    } catch (error) {
        console.error('Search error:', error);
        showToast('Error searching songs. Please try again.', true);
    }
}

// Update download functionality for real URLs
async function downloadSong(index) {
    const song = songs[index];
    const downloadBtn = document.querySelector(`#songsGrid .song-card:nth-child(${index + 1}) .download-btn`);
    
    try {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        showToast('Starting download...');

        const response = await fetch(song.downloadUrl);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${song.title} - ${song.artist}.mp3`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        showToast('Download completed successfully!');
    } catch (error) {
        console.error('Download error:', error);
        showToast('Error downloading song. Please try again later.', true);
    } finally {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
    }
}

// Add function to handle song ended
audioPlayer.addEventListener('ended', () => {
    if (repeatMode === 'one') {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
    } else {
        playNext();
    }
});

// Function to play next song
function playNext() {
    let nextIndex;
    if (isShuffled) {
        nextIndex = Math.floor(Math.random() * songs.length);
    } else {
        nextIndex = (currentSongIndex + 1) % songs.length;
    }
    playSong(nextIndex);
}

// Function to play previous song
function playPrevious() {
    let prevIndex;
    if (isShuffled) {
        prevIndex = Math.floor(Math.random() * songs.length);
    } else {
        prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    }
    playSong(prevIndex);
}

// Update event listeners
function setupEventListeners() {
    // Previous button
    prevBtn.addEventListener('click', playPrevious);

    // Next button
    nextBtn.addEventListener('click', playNext);

    // Play/Pause button
    playBtn.addEventListener('click', () => {
        if (audioPlayer.src) {
            if (isPlaying) {
                audioPlayer.pause();
            } else {
                audioPlayer.play();
            }
            isPlaying = !isPlaying;
            updatePlayButton();
        } else if (songs.length > 0) {
            playSong(0);
        }
    });

    // Volume control
    volumeSlider.addEventListener('input', updateVolume);
    
    // Progress bar
    progressArea.addEventListener('click', (e) => {
        const width = progressArea.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;
        audioPlayer.currentTime = (clickX / width) * duration;
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(currentTime);
        durationEl.textContent = formatTime(duration);
    });

    // Search functionality
    searchBtn.addEventListener('click', searchSongs);
    searchInput.addEventListener('keypress', (results) => {
        if (results.key === 'Enter') {
            searchSongs();
        }
    });

    // Language filter
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            languageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentLanguage = button.dataset.language;
            loadSongs();
        });
    });
}

// Initialize everything
window.addEventListener('load', () => {
    songs = sampleSongs;
    loadSongs();
    setupEventListeners();
    updateVolume();
});
