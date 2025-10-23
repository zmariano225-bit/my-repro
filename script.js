// Elementos del DOM
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const tituloEl = document.getElementById('titulo');
const artistaEl = document.getElementById('artista');
const playlistEl = document.getElementById('playlist');

// Variables globales
let playlist = [];
let currentIndex = 0;

// Cargar la playlist desde JSON
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

// Renderizar la lista de reproducción
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

// Cargar una canción
function loadSong(index) {
  const cancion = playlist[index];
  audioPlayer.src = cancion.archivo;
  tituloEl.textContent = cancion.titulo;
  artistaEl.textContent = cancion.artista;

  // Actualizar clase "playing"
  document.querySelectorAll('.playlist li').forEach((item, i) => {
    item.classList.toggle('playing', i === index);
  });
}

// Reproducir
function playSong() {
  audioPlayer.play();
  playBtn.textContent = '⏸';
}

// Pausar
function pauseSong() {
  audioPlayer.pause();
  playBtn.textContent = '▶';
}

// Siguiente canción
function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

// Canción anterior
function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadSong(currentIndex);
  playSong();
}

// Eventos
playBtn.addEventListener('click', () => {
  if (audioPlayer.paused) {
    playSong();
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Cuando termina una canción, pasa a la siguiente
audioPlayer.addEventListener('ended', nextSong);