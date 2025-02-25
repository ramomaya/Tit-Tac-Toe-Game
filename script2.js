const playGameBtn = document.getElementById('play-game-btn'); // viittaa aloittaa peli painike
const newGameBtn = document.getElementById('new-game-btn'); // viittaa uusi peli painike
const gameCells = document.querySelectorAll('.cell'); // hakee kaikki peliruudut, jossa peli tapahtuu

const aiMark = 'X'; // teköälyn on X-merkki
const humanMark = 'O'; // minä käytän O-merkki

// pelin muuttuijat
let model; // muuttuija, jossa talentaan TensorFow.js malli
let gameOver = true; // peli alkaa ei-aktiivisena
let playerTurn = true; // Pelaaja aloittaa eli minä aloittaa eka

// TensorFlow.js-mallin lataaminen tai luominen
async function loadModel() {
  try {
    model = await tf.loadLayersModel('localstorage://tic-tac-toe-model'); // yritetään ladata tallentu mallo
    console.log('Malli ladattu.');
  } catch (error) {
    console.log('Ei löytynyt tallennettua mallia, luodaan uusi.');
    await createModel(); // jos malli ei ole luodaan uusi maali createModel() funktiolla
  }
}

// Luo uusi neuroverkko malli, jos vanhaa ei löydy
async function createModel() {
  model = tf.sequential(); // luodaan mallia, jossa on peräkäistä kerroskiä
  model.add(
    tf.layers.dense({ units: 16, activation: 'relu', inputShape: [9] }) // esinmmäinen kerros 16 neuroia
  );
  model.add(tf.layers.dense({ units: 9, activation: 'softmax' })); // ulostulokerros, jossa 9 neuroia (1 jokaisella ruudulla)
  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' }); // mallin opetusasetukset

  await model.save('localstorage://tic-tac-toe-model'); // tallentaan malli selaimen muistiin
}

// AI:n siirto
async function insertCompMark() {
  if (!model || gameOver) return; // Estetään AI:n toiminta, jos peli on ohi tai mallia ei ole ladattu ei tehdä mitään

  // muutetaan pelilauta numerisksi muoodoksi
  const boardState = Array.from(gameCells).map((cell) =>
    cell.innerText === aiMark ? 1 : cell.innerText === humanMark ? -1 : 0
  );

  // AI tekee ennusteen seuraavasta siirrosta
  const prediction = model.predict(tf.tensor2d([boardState]));
  const predictionsArray = prediction.dataSync(); // Haetaan ennusteen tulokset taulukkoon

  let move = -1; // Muuttuja, joka tallentaa AI:n valitseman siirron. -1 tarkoittaa, ettei siirtoa ole vielä valittu.
  let highestValue = -Infinity; // Muuttuja, joka tallentaa korkeimman löydetyn ennustearvon. Alustetaan hyvin pienellä arvolla.

  // Etsitään paras siirto vapaista ruuduista
  for (let i = 0; i < predictionsArray.length; i++) {
    // Tarkistetaan, onko ruutu vapaa (0) ja onko ennustettu arvo suurempi kuin nykyinen korkein arvo
    if (boardState[i] === 0 && predictionsArray[i] > highestValue) {
      highestValue = predictionsArray[i]; // Päivitetään korkein löydetty arvo
      move = i; // Tallennetaan tämänhetkinen paras siirto
    }
  }

  if (move !== -1) {
    gameCells[move].innerText = aiMark; // AI tekee siirron valittuun ruutuun
    checkIfGameIsOver(); // tarkistetaan päätyikö peli
    playerTurn = true; // Vaihdetaan vuoro pelaajalle
  }
}

// Pelaajan siirto
function insertPlayersMark() {
  // Tarkistetaan, onko ruutu tyhjä ja peli käynnissä
  if (!this.innerText && !gameOver && playerTurn) {
    this.innerText = humanMark; // Pelaaja asettaa merkin ruutuun
    checkIfGameIsOver(); // Tarkistetaan, päättyikö peli
    playerTurn = false; // Vaihdetaan vuoro AI:lle
    setTimeout(insertCompMark, 300); // Pieni viive ennen tekoälyn siirtoon
  }
}

// Peli alkaa
function playGame() {
  gameOver = false; // Asetetaan peli aktiiviseksi
  playerTurn = true; // Pelaaja aloittaa
  loadModel(); // Ladataan AI-malli
  playGameBtn.style.display = 'none'; // Piilotetaan "Aloita peli" -painike
  newGameBtn.style.display = 'block'; // Näytetään "Uusi peli" -painike
}

// Uusi peli
function startNewGame() {
  gameOver = false; // Asetetaan peli aktiiviseksi
  playerTurn = true; // Pelaaja aloittaa
  gameCells.forEach((cell) => {
    cell.innerText = ''; // Tyhjennetään pelilauta
    cell.style.color = 'black'; // Palautetaan mustaksi
  });
}

// Tarkista voitto
function checkIfGameIsOver() {
  const winningCombos = [
    // Lista kaikista voittavien rivien yhdistelmistä
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let winnerFound = false; // Muuttuja, joka tallentaa tiedon löytyikö voittaja

  // Käydään läpi kaikki voittavat yhdistelmät
  winningCombos.forEach((combo) => {
    const [a, b, c] = combo; // Haetaan indeksit yhdistelmästä
    if (
      gameCells[a].innerText && // Tarkistetaan, että ruutu ei ole tyhjä
      gameCells[a].innerText === gameCells[b].innerText && // Tarkistetaan, että kolme ruutua ovat saman merkin
      gameCells[a].innerText === gameCells[c].innerText
    ) {
      gameOver = true; // Peli päättyy
      winnerFound = true; // Merkitään, että voittaja löytyi

      // Voittorivi vihreäksi
      gameCells[a].style.color = 'green';
      gameCells[b].style.color = 'green';
      gameCells[c].style.color = 'green';
      console.log('Peli päättyi! Voittaja:', gameCells[a].innerText); // Tulostetaan voittajan merkki
    }
  });

  // Tasapeli
  // Jos kaikki ruudut ovat täynnä eikä voittajaa löytynyt
  if (!winnerFound && [...gameCells].every((cell) => cell.innerText)) {
    gameOver = true; // Peli päättyy
    gameCells.forEach((cell) => (cell.style.color = 'grey')); // Kaikki ruudut muutetaan harmaiksi
    console.log('Tasapeli!'); // Ilmoitetaan tasapelistä
  }
}

// Kuuntelijat, jotka reagoivat käyttäjän toimintoihin
gameCells.forEach((cell) => cell.addEventListener('click', insertPlayersMark)); // Jokainen peliruutu kuuntelee klikkausta
playGameBtn.addEventListener('click', playGame); // "Aloita peli" -painike kuuntelee klikkausta
newGameBtn.addEventListener('click', startNewGame); // "Uusi peli" -painike kuuntelee klikkausta
