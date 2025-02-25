// Pelin käyttöliittymän elementtien valinta
const playGameBtn = document.getElementById('play-game-btn'); // viittaa "Aloita peli" -painikkeeseen
const newGameBtn = document.getElementById('new-game-btn'); // viittaa "Uusi peli" -painikkeeseen
const gameCells = document.querySelectorAll('.cell'); // hakee kaikki peliruudut, joissa peli tapahtuu

// AI:n ja pelaajan merkit
const aiMark = 'X'; // tekoälyn merkki
const humanMark = 'O'; // pelaajan merkki

// Pelin muuttujat
let model; // Muuttuja, jossa tallennetaan TensorFlow.js malli
let gameOver = true; // Pelin tila (onko peli päättynyt?)
let playerTurn = true; // Määrittelee, onko pelaajan vuoro

// Pelin historia (tallentaa pelitilanteet ja siirrot)
let history = []; // Tallentaa pelitilanteet ja tekoälyn/pelaajan siirrot

// TensorFlow.js-mallin lataaminen tai luominen
async function loadModel() {
  try {
    // Yritetään ladata tallennettu malli LocalStorage:sta
    model = await tf.loadLayersModel('localstorage://tic-tac-toe-model');
    console.log('Malli ladattu.');
  } catch (error) {
    // Jos mallia ei löydy, luodaan uusi malli
    console.log('Ei löytynyt tallennettua mallia, luodaan uusi.');
    await createModel();
  }
}

// Luo uusi neuroverkkomalli, jos vanhaa ei löytynyt
async function createModel() {
  model = tf.sequential(); // Luodaan tyhjä sekventiaalinen malli
  // Piilotettu kerros, jossa 16 neuroa ja ReLU-aktivaatiotoiminto
  model.add(
    tf.layers.dense({ units: 16, activation: 'relu', inputShape: [9] })
  );
  // Ulostulokerros, jossa 9 neuroa (1 jokaiselle peliruudulle)
  model.add(tf.layers.dense({ units: 9, activation: 'softmax' }));
  // Malli käännetään, jotta sitä voidaan käyttää
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });

  // Malli tallennetaan LocalStorage:en
  await model.save('localstorage://tic-tac-toe-model');
}

// AI:n siirto
async function insertCompMark() {
  if (!model || gameOver) return; // Jos malli ei ole ladattu tai peli on ohi, ei tehdä mitään

  // Pelitilanteen muutetaan numeeriseksi
  const boardState = Array.from(gameCells).map((cell) =>
    cell.innerText === aiMark ? 1 : cell.innerText === humanMark ? -1 : 0
  );

  // AI tekee ennusteen seuraavasta siirrosta
  const prediction = model.predict(tf.tensor2d([boardState]));
  const predictionsArray = prediction.dataSync(); // Ennusteiden taulukko

  let move = -1; // Muuttuja, joka tallentaa AI:n valitseman siirron
  let highestValue = -Infinity; // Tallentaa suurimman löydetyn ennustearvon

  // Etsitään paras siirto vapaista ruuduista
  for (let i = 0; i < predictionsArray.length; i++) {
    // Tarkistetaan, onko ruutu vapaa (0) ja onko ennustettu arvo suurempi kuin nykyinen korkein arvo
    if (boardState[i] === 0 && predictionsArray[i] > highestValue) {
      highestValue = predictionsArray[i]; // Päivitetään korkein löydetty arvo
      move = i; // Päivitetään paras siirto
    }
  }

  if (move !== -1) {
    gameCells[move].innerText = aiMark; // AI asettaa merkin valittuun ruutuun
    history.push({ boardState, move, aiMark }); // Tallennetaan pelitilanne ja tekoälyn siirto historiaan
    checkIfGameIsOver(); // Tarkistetaan, päättyikö peli
    playerTurn = true; // Vaihdetaan vuoro pelaajalle
  }
}

// Pelaajan siirto
function insertPlayersMark() {
  // Tarkistetaan, onko ruutu tyhjä ja peli käynnissä
  if (!this.innerText && !gameOver && playerTurn) {
    this.innerText = humanMark; // Pelaaja asettaa merkin ruutuun
    // Tallennetaan pelaajan siirto historiaan
    history.push({
      boardState: Array.from(gameCells).map((cell) =>
        cell.innerText === aiMark ? 1 : cell.innerText === humanMark ? -1 : 0
      ),
      move: Array.from(gameCells).indexOf(this),
      humanMark,
    });
    checkIfGameIsOver(); // Tarkistetaan, päättyikö peli
    playerTurn = false; // Vaihdetaan vuoro tekoälylle
    setTimeout(insertCompMark, 300); // AI:n siirto viiveellä
  }
}

// Peli alkaa
function playGame() {
  gameOver = false; // Pelitila asetetaan aktiiviseksi
  playerTurn = true; // Pelaaja aloittaa
  loadModel(); // Ladataan AI-malli
  playGameBtn.style.display = 'none'; // Piilotetaan "Aloita peli" -painike
  newGameBtn.style.display = 'block'; // Näytetään "Uusi peli" -painike
}

// Uusi peli
function startNewGame() {
  gameOver = false; // Pelitila asetetaan aktiiviseksi
  playerTurn = true; // Pelaaja aloittaa
  gameCells.forEach((cell) => {
    cell.innerText = ''; // Tyhjennetään pelilauta
    cell.style.color = 'black'; // Palautetaan ruutujen väri
  });
  history = []; // Tyhjennetään pelihistoria
}

// Tarkista, päättyikö peli (esim. voitto tai tasapeli)
function checkIfGameIsOver() {
  const winningCombos = [
    [0, 1, 2], // Voittavien rivien yhdistelmät
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winnerFound = false; // Merkitään, löytyikö voittaja

  winningCombos.forEach((combo) => {
    const [a, b, c] = combo; // Haetaan voittavien ruutujen indeksit
    if (
      gameCells[a].innerText && // Tarkistetaan, että ruutu ei ole tyhjä
      gameCells[a].innerText === gameCells[b].innerText && // Tarkistetaan, että kolme ruutua ovat saman merkin
      gameCells[a].innerText === gameCells[c].innerText
    ) {
      gameOver = true; // Peli päättyy
      winnerFound = true; // Merkitään, että voittaja löytyi
      gameCells[a].style.color = 'green'; // Väritetään voittorivi vihreäksi
      gameCells[b].style.color = 'green';
      gameCells[c].style.color = 'green';
      console.log('Peli päättyi! Voittaja:', gameCells[a].innerText);
    }
  });

  // Tasapeli
  // Jos kaikki ruudut ovat täynnä eikä voittajaa löytynyt, peli päättyy tasapeliin
  if (!winnerFound && [...gameCells].every((cell) => cell.innerText)) {
    gameOver = true;
    gameCells.forEach((cell) => (cell.style.color = 'grey')); // Väritetään kaikki ruudut harmaaksi
    console.log('Tasapeli!');
  }
}

// Kuuntelijat, jotka reagoivat käyttäjän toimintoihins
gameCells.forEach((cell) => cell.addEventListener('click', insertPlayersMark)); // Kun käyttäjä klikkaa peliruutua, peliruutu vastaanottaa pelaajan siirron
playGameBtn.addEventListener('click', playGame); // Kun "Aloita peli" -painiketta klikataan, peli alkaa
newGameBtn.addEventListener('click', startNewGame); // Kun "Uusi peli" -painiketta klikataan, peli aloitetaan alusta
