// Obtener elementos del DOM
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-button");
const modeSelection = document.getElementById("mode-selection");
const manualModeButton = document.getElementById("manual-mode");
const automaticModeButton = document.getElementById("automatic-mode");
const gameContainer = document.getElementById("game-container");
const numbersBoard = document.getElementById("numbers-board");
const currentNumberElement = document.getElementById("current-number");
const manualControls = document.getElementById("manual-controls");
const generateButton = document.getElementById("generate-number");
const repeatButton = document.getElementById("repeat-numbers");
const resetButton = document.querySelectorAll("#reset");
const backButton = document.querySelectorAll("#back-to-start");
const automaticControls = document.getElementById("automatic-controls");
const intervalSelector = document.getElementById("interval");
const startAutoButton = document.getElementById("start-auto");
const stopAutoButton = document.getElementById("stop-auto");
const repeatButtonAuto = document.getElementById("repeat-numbers-auto");

// Variables del juego
let numbers = Array.from({ length: 90 }, (_, i) => i + 1);
let calledNumbers = [];
let autoModeInterval = null;
let audioCache = {};
let isPlaying = false; // Indicador para controlar la reproducción

// Pre-cargar audios
function preloadAudio() {
  for (let i = 1; i <= 90; i++) {
    const audio = new Audio(encodeURI(`Números/${i}.mp3`));
    audioCache[i] = audio;
  }
}

// Generar el tablero de números
function generateNumbersBoard() {
  numbersBoard.innerHTML = ""; // Limpia el tablero
  for (let i = 1; i <= 90; i++) {
    const cell = document.createElement("div");
    cell.classList.add("number-cell");
    cell.textContent = i;
    numbersBoard.appendChild(cell);
  }
}

// Marcar número como seleccionado
function markNumber(number) {
  const cells = numbersBoard.querySelectorAll(".number-cell");
  cells[number - 1].classList.add("selected");
}

// Reproducir el audio correspondiente al número
function playAudio(number, callback) {
  const audio = audioCache[number];
  if (audio) {
    isPlaying = true;
    audio.play().catch(error => {
      console.error(`Error al reproducir el audio del número ${number}:`, error);
    });
    audio.onended = () => {
      isPlaying = false;
      if (callback) callback();
    };
  } else {
    console.warn(`Audio no encontrado para el número ${number}`);
    if (callback) callback();
  }
}

// Generar un número aleatorio
function generateNumber() {
  if (isPlaying) return; // Evitar que se genere un nuevo número si ya hay audio reproduciéndose
  if (numbers.length === 0) {
    currentNumberElement.textContent = "¡Todos los números han sido llamados!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * numbers.length);
  const number = numbers.splice(randomIndex, 1)[0];
  calledNumbers.push(number);
  currentNumberElement.textContent = `Número: ${number}`;
  markNumber(number);
  playAudio(number); // Reproducir el audio
}

// Repetir números en orden
function repeatNumbersInOrder() {
  if (calledNumbers.length === 0) {
    currentNumberElement.textContent = "No se han llamado números.";
    return;
  }
  stopAutoMode();
  calledNumbers.sort((a, b) => a - b);
  let index = 0;

  function playNextNumber() {
    if (index < calledNumbers.length) {
      const number = calledNumbers[index];
      currentNumberElement.textContent = `Número: ${number}`;
      markNumber(number);
      playAudio(number, () => {
        setTimeout(() => {
          index++;
          playNextNumber();
        }, 2000); // Descanso de 2 segundos entre números
      });
    }
  }

  playNextNumber();
}


// Modo automático
function startAutoMode(interval) {
  autoModeInterval = setInterval(() => {
    if (!isPlaying) {
      generateNumber();
      if (numbers.length === 0) {
        stopAutoMode();
      }
    }
  }, interval);
  stopAutoButton.disabled = false;
  startAutoButton.disabled = true;
}

function stopAutoMode() {
  clearInterval(autoModeInterval);
  autoModeInterval = null;
  stopAutoButton.disabled = true;
  startAutoButton.disabled = false;
}

// Reiniciar juego
function resetGame() {
  numbers = Array.from({ length: 90 }, (_, i) => i + 1);
  calledNumbers = [];
  currentNumberElement.textContent = "Presiona para comenzar";
  stopAutoMode();
  generateNumbersBoard();
}

// Volver al inicio
function backToStart() {
  gameContainer.style.display = "none";
  modeSelection.style.display = "none";
  startScreen.style.display = "flex";
  resetGame();
}

// Eventos del DOM
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  modeSelection.style.display = "flex";
});

manualModeButton.addEventListener("click", () => {
  modeSelection.style.display = "none";
  gameContainer.style.display = "block";
  manualControls.style.display = "flex";
  automaticControls.style.display = "none";
  resetGame();
});

automaticModeButton.addEventListener("click", () => {
  modeSelection.style.display = "none";
  gameContainer.style.display = "block";
  manualControls.style.display = "none";
  automaticControls.style.display = "flex";
  resetGame();
});

generateButton.addEventListener("click", generateNumber);
repeatButton.addEventListener("click", repeatNumbersInOrder);
repeatButtonAuto.addEventListener("click", repeatNumbersInOrder);

startAutoButton.addEventListener("click", () => {
  const interval = parseInt(intervalSelector.value);
  startAutoMode(interval);
});

stopAutoButton.addEventListener("click", stopAutoMode);

resetButton.forEach(button => button.addEventListener("click", resetGame));
backButton.forEach(button => button.addEventListener("click", backToStart));

// Inicializar el tablero y precargar audios
generateNumbersBoard();
preloadAudio();
