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
const voiceSelect = document.getElementById("voice-select");
const voiceSettingsButton = document.getElementById("voice-settings-button");
const voiceDropdown = document.getElementById("voice-dropdown");

// Variables del juego
let numbers = Array.from({ length: 90 }, (_, i) => i + 1);
let calledNumbers = [];
let autoModeInterval = null;
let voices = [];

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

// Reproducir voz
function speakNumber(number) {
  const utterance = new SpeechSynthesisUtterance(`${number}`);
  utterance.lang = 'es-ES'; // Establecer idioma a español

  // Obtener la voz seleccionada
  const selectedVoice = voiceSelect.value;
  const voice = voices.find(voice => voice.name === selectedVoice);
  utterance.voice = voice; // Asignar la voz seleccionada

  speechSynthesis.speak(utterance);
}

// Generar un número aleatorio
function generateNumber() {
  if (numbers.length === 0) {
    currentNumberElement.textContent = "¡Todos los números han sido llamados!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * numbers.length);
  const number = numbers.splice(randomIndex, 1)[0];
  calledNumbers.push(number);
  currentNumberElement.textContent = `Número: ${number}`;
  markNumber(number);
  
  // Reproducir el número en voz alta
  speakNumber(number);
}

// Repetir números en orden
function repeatNumbersInOrder() {
  if (calledNumbers.length === 0) {
    currentNumberElement.textContent = "No se han llamado números.";
    return;
  }
  stopAutoMode();
  // Ordenar los números llamados
  calledNumbers.sort((a, b) => a - b);
  // Reproducir los números en orden
  calledNumbers.forEach(number => {
    setTimeout(() => {
      currentNumberElement.textContent = `Número: ${number}`;
      markNumber(number);
      speakNumber(number);
    }, 2000 * calledNumbers.indexOf(number));
  });
}

// Modo automático
function startAutoMode(interval) {
  autoModeInterval = setInterval(() => {
    generateNumber();
    if (numbers.length === 0) {
      stopAutoMode();
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
  showVoiceSelection(); // Mostrar selección de voz
  resetGame();
});

automaticModeButton.addEventListener("click", () => {
  modeSelection.style.display = "none";
  gameContainer.style.display = "block";
  manualControls.style.display = "none";
  automaticControls.style.display = "flex";
  showVoiceSelection(); // Mostrar selección de voz
  resetGame();
});

generateButton.addEventListener("click", generateNumber);
repeatButton.addEventListener("click", repeatNumbersInOrder); // Repetir números en modo manual
repeatButtonAuto.addEventListener("click", repeatNumbersInOrder); // Repetir números en modo automático

startAutoButton.addEventListener("click", () => {
  const interval = parseInt(intervalSelector.value);
  startAutoMode(interval);
});

stopAutoButton.addEventListener("click", stopAutoMode);

resetButton.forEach(button => button.addEventListener("click", resetGame));
backButton.forEach(button => button.addEventListener("click", backToStart));

// Inicializar el tablero
generateNumbersBoard();

// Cargar voces disponibles
function populateVoiceList() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = ""; // Limpiar opciones anteriores
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = `${voice.name} (${voice.lang})`;
    voiceSelect.appendChild(option);
  });
}

// Llamar a populateVoiceList cuando las voces están disponibles
if (typeof speechSynthesis !== 'undefined' && speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Mostrar y ocultar selección de voz
function showVoiceSelection() {
  voiceSettingsButton.addEventListener("click", () => {
    voiceDropdown.style.display = voiceDropdown.style.display === "none" ? "block" : "none";
  });
}

// Inicializar selección de voz
populateVoiceList();
showVoiceSelection();

