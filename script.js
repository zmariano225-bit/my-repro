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
  .then(response => {
    if (!response.ok) throw new Error('No se pudo cargar playlist.json');
    return response.json();
  })
  .then(data => {
    playlist = data.canciones;
    renderPlaylist();
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
      // Actualizar UI
      tituloEl.textContent = cancion.titulo;
      artistaEl.textContent = cancion.artista;

      // Marcar como reproducción actual
      document.querySelectorAll('.playlist li').forEach((item, i) => {
        item.classList.toggle('playing', i === index);
      });

      // Establecer fuente de audio
      audioPlayer.src = cancion.archivo;
      currentIndex = index;

      // Reproducir INMEDIATAMENTE dentro del evento de clic (requerido por Chrome)
      audioPlayer.play()
        .then(() => {
          playBtn.textContent = '⏸';
        })
        .catch(error => {
          console.warn('Reproducción bloqueada por el navegador:', error);
          tituloEl.textContent = '⚠️ Haz clic para reproducir (bloqueado)';
          playBtn.textContent = '▶';
        });
    });
    playlistEl.appendChild(li);
  });
}

// Función para pausar
function pauseSong() {
  audioPlayer.pause();
  playBtn.textContent = '▶';
}

// Siguiente canción
function nextSong() {
  currentIndex = (currentIndex + 1) % playlist.length;
  const cancion = playlist[currentIndex];
  
  tituloEl.textContent = cancion.titulo;
  artistaEl.textContent = cancion.artista;
  audioPlayer.src = cancion.archivo;

  document.querySelectorAll('.playlist li').forEach((item, i) => {
    item.classList.toggle('playing', i === currentIndex);
  });

  audioPlayer.play()
    .then(() => {
      playBtn.textContent = '⏸';
    })
    .catch(e => {
      console.warn('Autoplay bloqueado al cambiar de canción:', e);
      playBtn.textContent = '▶';
    });
}

// Canción anterior
function prevSong() {
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  const cancion = playlist[currentIndex];
  
  tituloEl.textContent = cancion.titulo;
  artistaEl.textContent = cancion.artista;
  audioPlayer.src = cancion.archivo;

  document.querySelectorAll('.playlist li').forEach((item, i) => {
    item.classList.toggle('playing', i === currentIndex);
  });

  audioPlayer.play()
    .then(() => {
      playBtn.textContent = '⏸';
    })
    .catch(e => {
      console.warn('Autoplay bloqueado:', e);
      playBtn.textContent = '▶';
    });
}

// Controles manuales
playBtn.addEventListener('click', () => {
  if (audioPlayer.paused || audioPlayer.ended) {
    // Solo intentar reproducir si ya hay una fuente cargada
    if (audioPlayer.src) {
      audioPlayer.play()
        .then(() => {
          playBtn.textContent = '⏸';
        })
        .catch(e => {
          console.warn('Reproducción manual bloqueada:', e);
        });
    }
  } else {
    pauseSong();
  }
});

nextBtn.addEventListener('click', nextSong);
prevBtn.addEventListener('click', prevSong);

// Cuando termina una canción, pasar a la siguiente
audioPlayer.addEventListener('ended', nextSong);
