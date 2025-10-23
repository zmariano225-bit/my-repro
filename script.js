const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const tituloEl = document.getElementById('titulo');
const artistaEl = document.getElementById('artista');
const playlistEl = document.getElementById('playlist');

let playlist = [];
let currentIndex = 0;

fetch('playlist.json')
  .then(response => response.json())
  .then(data => {
    playlist = data.canciones;
    renderPlaylist();
    loadSong(currentIndex);
  })
  .catch(err => {
    console.error('Error al cargar la playlist:', err);
    tituloEl.textContent = '❌ Error al cargar la música';
  });

function renderPlaylist() {
  playlistEl.innerHTML = '';
  playlist.forEach((cancion, index) => {
    const li = document.createElement('li');
    li.textContent = `${cancion.titulo} – ${cancion.artista}`;
    li.addEventListener('click', () => {
      currentIndex = index;
      loadSong(currentIndex);
      playSong();
    });
    playlistEl.appendChild(li);
  });
}

function loadSong(index) {
  const cancion = playlist[index];
  audioPlayer.src = cancion.archivo;
  tituloEl.textContent = cancion.titulo;
  artistaEl.textContent = cancion.artista;

  document.querySelectorAll('.playlist li').forEach((item, i) => {
    item.classList.toggle('playing', i === index);
  });
}

function playSong() {
  audioPlayer.play().catch(e => {
    console.warn("Reproducción bloqueada por el navegador:", e);
    tituloEl.textContent = "Haz clic para reproducir (bloqueado)";
  });
  playBtn.textContent = '⏸';
}

function pauseSong() {
  audioPlayer.pause();
  playBtn.textContent = '▶';
}

function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

audioPlayer.addEventListener('ended', nextSong);
