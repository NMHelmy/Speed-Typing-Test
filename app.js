let timer;                  // Stores the timer interval
let isRunning = false;      // Flag to track if test is running
let startTime;              // When test started
let endTime;                // When test ended
let correctCharacters = 0;  // Count of correctly typed chars
let totalCharacters = 0;    // Total chars typed
let currentParagraph = "";  // Current paragraph being typed
let currentPosition = 0;    // Current cursor position

// DOM elements
const paragraphBox = document.getElementById('paragraph-box');
const inputField = document.getElementById('input-field');
const startButton = document.getElementById('start-bttn');
const accContainer = document.getElementById('acc_container');
const timerContainer = document.getElementById('timer_container');
const wpmContainer = document.getElementById('wpm_container');

// An array of sample text for the typing test.
const sampleParagraphs = [
  "The quick brown fox jumps over the lazy dog. This sentence contains all the letters in the English alphabet.",
  "Programming is the art of telling another human what one wants the computer to do. Good code is its own best documentation.",
  "The only way to learn a new programming language is by writing programs in it. The more you code, the better you become.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
  "Simplicity is the soul of efficiency. Make it work, make it right, make it fast, in that order."
];

function startTest() {
  if (isRunning) return;
  
  // Reset state for a new test
  isRunning = true;
  correctCharacters = 0;
  totalCharacters = 0;
  currentPosition = 0;
  
  // Select random paragraph
  currentParagraph = sampleParagraphs[Math.floor(Math.random() * sampleParagraphs.length)];
  paragraphBox.innerHTML = currentParagraph.split('').map(char => 
      `<span class="original">${char}</span>`
  ).join('');
  
  // Reset stats
  accContainer.textContent = '0%';
  timerContainer.textContent = '0';
  wpmContainer.textContent = '0';
  
  // Focus input field - making it active and ready to receive keyboard input
  inputField.value = '';
  inputField.focus();
  
  // Start timer
  startTime = new Date();
  timer = setInterval(updateTimer, 1000);
  
  // Update button
  startButton.textContent = 'RESET';
}

function updateTimer() {
  const currentTime = new Date();
  const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
  timerContainer.textContent = elapsedSeconds;
}

function checkInput() {
  if (!isRunning) return;
  
  const inputText = inputField.value;
  const inputLength = inputText.length;
  
  // Reset all spans to original state
  const spans = paragraphBox.querySelectorAll('span');
  spans.forEach(span => {
      span.className = 'original';
  });
  
  // Update current position
  currentPosition = inputLength;
  
  // Check each character
  let correctCount = 0;
  for (let i = 0; i < inputLength; i++) {
      if (i >= currentParagraph.length) break;
      
      if (inputText[i] === currentParagraph[i]) {
          spans[i].className = 'correct';
          correctCount++;
      } else {
          spans[i].className = 'wrong';
      }
  }
  
  // Highlight current position
  if (currentPosition < spans.length) {
      spans[currentPosition].classList.add('cursor-highlight');
  }
  
  // Update stats
  totalCharacters = inputLength;
  correctCharacters = correctCount;
  updateStats();
  
  // Check if test is complete
  if (inputLength === currentParagraph.length) {
      endTest();
  }
}

function updateStats() {
  // Calculate accuracy
  const accuracy = totalCharacters > 0 
      ? Math.round((correctCharacters / totalCharacters) * 100) 
      : 0;
  accContainer.textContent = `${accuracy}%`;
  
  // Calculate WPM (assuming 5 characters = 1 word)
  const currentTime = new Date();
  const elapsedMinutes = (currentTime - startTime) / 60000;
  const wpm = elapsedMinutes > 0 
      ? Math.round((correctCharacters / 5) / elapsedMinutes)
      : 0;
  wpmContainer.textContent = wpm;
}

function endTest() {
  clearInterval(timer);
  isRunning = false;
  endTime = new Date();
  inputField.blur();
}

function resetTest() {
  clearInterval(timer);
  isRunning = false;
  paragraphBox.innerHTML = '<p>Press start to start typing....</p>';
  inputField.value = '';
  accContainer.textContent = '';
  timerContainer.textContent = '';
  wpmContainer.textContent = '';
  startButton.textContent = 'START';
}

function focusNow() {
  if (isRunning) {
      inputField.focus();
  }
}

function again() {
  if (isRunning) {
      resetTest();
  } else {
      startTest();
  }
}

// Initialize
inputField.addEventListener('input', checkInput);
paragraphBox.addEventListener('click', focusNow);
startButton.addEventListener('click', again);

