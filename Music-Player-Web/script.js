document.addEventListener("DOMContentLoaded", function () {
  const audio = document.getElementById("audio");
  const playPauseButton = document.getElementById("play-pause");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const songTitle = document.querySelector(".song-title");
  const progressBar = document.getElementById("progress");
  const indicator = document.querySelector(".indicator");
  const timeDisplay = document.getElementById("time");
  const albumCover = document.getElementById("album-cover");
  const modelContainer = document.getElementById('modelContainer');
  const modelViewer = document.getElementById('modelViewer');
  const volumeButton = document.getElementById("volume-button");
  const volumeControl = document.getElementById("volumeControl");
    volumeControl.value = 0.5;  // default volume level (50%)
    audio.volume = volumeControl.value;

    volumeControl.addEventListener("input", () => {
      audio.volume = volumeControl.value;
    });
    
  const progressBarContainer = document.querySelector(".progress-bar-container");

    let isDragging = false;

    // Click to seek
    progressBarContainer.addEventListener("click", (e) => {
      const rect = progressBarContainer.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = clickX / rect.width;
      audio.currentTime = percentage * audio.duration;
    });

    // Start dragging
    progressBarContainer.addEventListener("mousedown", (e) => {
      isDragging = true;
      seekAudio(e);
    });

    // Stop dragging
    document.addEventListener("mouseup", () => {
      isDragging = false;
    });

    // Drag to seek
    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        seekAudio(e);
      }
    });

// Utility: Seeks audio based on mouse event
function seekAudio(e) {
  const rect = progressBarContainer.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const clampedX = Math.max(0, Math.min(x, rect.width));
  const percentage = clampedX / rect.width;
  audio.currentTime = percentage * audio.duration;
}




  let currentSongIndex = 0;
  let isPlaying = false;
  const supportsMediaSession = ('mediaSession' in navigator);
  
    function loadSong(song) {
  audio.src = song.src;
  songTitleElement.textContent = song.title;
  artistElement.textContent = song.artist;

  setBackground(song.bgClass);
  updateButtonColors(song.buttonColor);
  loadModelForSong(song.title);
}


  const songThemes = {
  "FeelxFeel.mp3": {
    background: "linear-gradient(135deg, #00509f, #00a2df, #ffdd00, #f7e501)"
  },
  "Another Song": {
    background: "linear-gradient(135deg, #8e2de2, #4a00e0)"
  }
  // Add more songs here
  };
  const songs = [
  {
    title: "Machine Love",
    src: "songs/Machine Love.mp3",
    artist: "JAMIE PAGE",
    buttonColor: "#ff0045",
    bgClass: "bg-machine-love"
  },
  {
    title: "Feel it x Feel it",
    src: "songs/FeelxFeel.mp3",
    artist: "D4VID",
    buttonColor: "#00509f",
    bgClass: "bg-invincible"
  },
  {
    title: "Love For You",
    src: "songs/loveforyou.mp3",
    artist: "LOVELI LORI",
    buttonColor: "#fc93e8",
    bgClass: "bg-just-a-girl"
  },
  {
    title: "Back in Black",
    src: "songs/BACKINBLACK.mp3",
    artist: "AC/DC",
    buttonColor: "#ff0045",
    bgClass: "bg-iron-man"
  }
];



  function loadModelForSong(songTitle) {
  const modelViewer = document.getElementById("modelViewer");
  const modelContainer = document.getElementById("modelContainer");

  // Remove old background classes
  document.body.classList.remove("bg-machine-love", "bg-invincible", "bg-just-a-girl","bg-iron-man", "animated-bg");

  if (songTitle === "Machine Love") {
    modelViewer.src = "/3d/MachineLove.glb";
    modelContainer.style.display = "block";
    document.body.classList.add("bg-machine-love", "animated-bg");
  } else if (songTitle === "Feel it x Feel it") {
    modelViewer.src = "/3d/invincibleormarkgrayson.glb";
    modelContainer.style.display = "block";
    document.body.classList.add("bg-invincible", "animated-bg");
  } else if (songTitle === "Love For You") {
    modelViewer.src = "/3d/just_a_girl.glb";
    modelContainer.style.display = "block";
    document.body.classList.add("bg-just-a-girl", "animated-bg");
  }else if (songTitle === "Back in Black") {
    modelViewer.src = "/3d/iron_man_rig.glb";
    modelContainer.style.display = "block";
    document.body.classList.add("bg-iron-man", "animated-bg"); 
  } else {
    modelContainer.style.display = "none";
  }
}

  function loadAndPlayCurrentSong() {
  const currentSong = songs[currentSongIndex];
  loadModelForSong(currentSong.title);
  audio.src = currentSong.src;
  audio.load();
  if (isPlaying) audio.play();
  playPauseButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  songTitle.textContent = currentSong.title;

  //  Dynamic background theme logic
  document.body.classList.remove("bg-machine-love", "bg-invincible", "bg-just-a-girl", "default-bg");

if (currentSong.title === "Machine Love") {
  document.body.classList.add("bg-machine-love");
} else if (currentSong.title === "Feel it x Feel it") {
  document.body.classList.add("bg-invincible");
} else if (currentSong.title === "Love For You") {
  document.body.classList.add("bg-just-a-girl");
} else if (currentSong.title === "Back in Black") {
  document.body.classList.add("bg-iron-man");
} else {
  document.body.classList.add("default-bg");
}

  updateButtonColors(currentSong.buttonColor || "#ff0045");

  

  // 📱 Media Session API (for mobile metadata)
  if (supportsMediaSession) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentSong.title,
      artist: currentSong.artist,
      album: 'Example Album Name',
    });
  }

    prefetchNextImage();
  }

  function prefetchNextImage() {
    const nextSongIndex = (currentSongIndex + 1) % songs.length;
    const aspectRatio = "280x200";
    const searchTerm = "illustration";
    const unsplashUrl = `https://source.unsplash.com/random/${aspectRatio}/?${searchTerm}&${Date.now()}`;
    const nextSongImage = new Image();
    nextSongImage.src = unsplashUrl;
    nextSongImage.onload = () => { albumCover.src = nextSongImage.src; };
  }

  function togglePlayPause() {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    isPlaying = !isPlaying;
    playPauseButton.innerHTML = isPlaying ? '<i class="fas fa-pause"></i>' : '<i class="fas fa-play"></i>';
  }

  audio.onloadeddata = () => {
    timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
  };

  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = progress + "%";
    indicator.style.left = progress + "%";
    timeDisplay.textContent = formatTime(audio.currentTime) + " / " + formatTime(audio.duration);
  });

  audio.addEventListener("ended", () => {
    resetProgressBar();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlayCurrentSong();
  });

  function resetProgressBar() {
    progressBar.style.width = "0%";
    indicator.style.left = "0%";
    timeDisplay.textContent = "0:00 / 0:00";
  }

  playPauseButton.addEventListener("click", togglePlayPause);

  function playNextSong() {
    resetProgressBar();
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadAndPlayCurrentSong();
  }
  nextButton.addEventListener("click", playNextSong);

  function playPreviousSong() {
    resetProgressBar();
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadAndPlayCurrentSong();
  }
  prevButton.addEventListener("click", playPreviousSong);

  document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
      event.preventDefault();
      togglePlayPause();
    } else if (event.key === "ArrowRight") {
      playNextSong();
    } else if (event.key === "ArrowLeft") {
      playPreviousSong();
    }
  });

  if (supportsMediaSession) {
    navigator.mediaSession.setActionHandler('nexttrack', playNextSong);
    navigator.mediaSession.setActionHandler('previoustrack', playPreviousSong);
    navigator.mediaSession.setActionHandler('pause', () => { if (isPlaying) togglePlayPause(); });
    navigator.mediaSession.setActionHandler('play', () => { if (!isPlaying) togglePlayPause(); });
  }

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  // document.getElementById("font-button").addEventListener("click", () => {
  //   const selectedFont = document.getElementById("font-selector").value;
  //   document.getElementById("Music").style.fontFamily = selectedFont;
  // });

  loadAndPlayCurrentSong();
});
