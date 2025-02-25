/**täässä lisätään logikkaa ja perustoiminnot ristinollapelilla */

// vaihe 2 lisätään hieman logiikkaa
const playGameBtn = document.getElementById('play-game-btn'); // hakee PlayGame painike
const newGameBtn = document.getElementById('new-game-btn'); // hakee NewGame painike
const gameCells = document.querySelectorAll('.cell'); // Hakee kaikki pelilaudan ruudut (ne, joilla on class="cell")
const aiMark = 'X'; // Määrittää tietokoneen käyttämän merkin "X".
const humanMark = 'O'; // Määrittää pelaajan käyttämän merkin "O".

let gameOver = true; // Aluksi true, tarkoittaen, että peli ei ole vielä alkanut

/**käy läpi jaokainen ruuduko ja sitten suoritetaan kilktapahtuma insertPlayerMark */
gameCells.forEach((c) => c.addEventListener('click', insertPlayersMark));
// lisätään tapahtumakäsittelijä playGame ja newGame ja kutusutaan funkioita
playGameBtn.addEventListener('click', playGame);
newGameBtn.addEventListener('click', startNewGame);

/**pelaajan merkien lisääminen */
function insertPlayersMark() {
  // this.innerText: onko ruutu tyhjä
  // gameOver: onko peli kesken
  if (!this.innerText && !gameOver) {
    this.innerText = humanMark; //aseteaan ruudun pelaja O ja kutsutaan checkIfGameIsover funktio
    checkIfGameIsOver();
  }
  if (!gameOver) {
    insertCompMark(); // kutsutaan inserrComMark funktio
    checkIfGameIsOver(); // funktio tarkistetaan onko peli päättynyt
  }
}

// pelin käynnistäminen
function playGame() {
  insertCompMark();
  checkIfGameIsOver();
  // piilotetaan painikeet
  playGameBtn.style.display = 'none';
  newGameBtn.style.display = 'block';
}

// uuden pelin aloittaminen
function startNewGame() {
  gameOver = false; // uusi peli alkaa
  gameCells.forEach((i) => {
    i.innerText = ''; // ruuduut tyhjentään
    i.style.color = '#4b3621'; // Ruudun tekstin väri palautetaan ruskeaksi
  });
}

function insertCompMark() {
  // vaihe 3: tallenamme pelilauden nykyinen tila cuurentBoardState
  // taulukossa on ["X", 1, "O", "X", 4, "X", "O", "O", 8];
  const currentBoardState = [];

  // Tallennetaan kunkin solun nykyinen arvo
  gameCells.forEach((c, i) => {
    c.innerText
      ? currentBoardState.push(c.innerText)
      : currentBoardState.push(i);
  });

  /** vaihe 4 Luo filter()-menetelmällä uusi taulukko, joka sisältää kaikki taulukon
   * alkiot, jotka eivät ole tai .currentBoardState"X""O" */
  function getAllEmptyCellsIndexes(currBdSt) {
    return currBdSt.filter((i) => i != 'X' && i != 'O');
  }

  // vaihe 5. Luo voittajan määritysfunktio ja tarkoitus on vastaanottaa taulukko ja tietyn pelaajan merkki
  function checkIfWinnerFound(currBdSt, currMark) {
    if (
      (currBdSt[0] === currMark &&
        currBdSt[1] === currMark &&
        currBdSt[2] === currMark) ||
      (currBdSt[3] === currMark &&
        currBdSt[4] === currMark &&
        currBdSt[5] === currMark) ||
      (currBdSt[6] === currMark &&
        currBdSt[7] === currMark &&
        currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark &&
        currBdSt[3] === currMark &&
        currBdSt[6] === currMark) ||
      (currBdSt[1] === currMark &&
        currBdSt[4] === currMark &&
        currBdSt[7] === currMark) ||
      (currBdSt[2] === currMark &&
        currBdSt[5] === currMark &&
        currBdSt[8] === currMark) ||
      (currBdSt[0] === currMark &&
        currBdSt[4] === currMark &&
        currBdSt[8] === currMark) ||
      (currBdSt[2] === currMark &&
        currBdSt[4] === currMark &&
        currBdSt[6] === currMark)
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**Tämän vuoksi yllä funktio suodattaa pois kaikki indeksin
   * esiintymät matriisissa esim getAllEmptyCellsIndexes() ja currentBoardState() */

  /** Minimax-algoritmi on vain tavallinen funktio, joka sisältää lauseita,
   * jotka suoritetaan, kun toiminto kutsutaan. */

  // vaihe 6 Luo Minimax-algoritmi
  function minimax(currBdSt, currMark) {
    //  vaihe 8 tallennamme palautetun indeksien taulukkoluettelon muuttujaan nimeltä avaolCellsIndexes
    const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);

    /** vaihe 9 tämä koodi pätkä käskee aktiivista minimax-funktiota palauttamaan
     * asianmukaisen päätetilan pistemäärän (, tai ) ja lopettamaan kutsunsa aina,
     * kun se löytää päätetilan (häviää, voittaa tai tasapelin).-1 +1 0 */
    if (checkIfWinnerFound(currBdSt, humanMark)) {
      return { score: -1 };
    } else if (checkIfWinnerFound(currBdSt, aiMark)) {
      return { score: 1 };
    } else if (availCellsIndexes.length === 0) {
      return { score: 0 };
    }

    // vaihe 10 Tämä koeajo on se, mitä meidän on tehtävä nyt. tarvitsemme paikan,
    // johon voimme tallentaa kunkin testin tuloksen
    const allTestPlayInfos = [];

    //  vaihe 10 luodaan for-loop-lause, joka käy läpi jokaisen tyhjän solun eli ruuduun
    for (let i = 0; i < availCellsIndexes.length; i++) {
      // vaihe 11 voit tallentaa tämän testipelin päätepisteet
      const currentTestPlayInfo = {};

      // 11. tallennetaan solun indeksinumero, jotta solun tiedot on helppo nollata tämän testitoiston jälkeen
      currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];

      // vaihe 11 Laitetaan nyt nykyisen pelaajan merkki punaiseen soluun ja
      // Aseta nykyisen pelaajan merkki käsiteltävään ruutuun:
      currBdSt[availCellsIndexes[i]] = currMark;

      if (currMark === aiMark) {
        // vaihe 11 suorita minimax-rekursio uudella laudella
        const result = minimax(currBdSt, humanMark);

        // vaihe 12 tallen tulosken pisteytys currentTestPlayInfo objetiin
        currentTestPlayInfo.score = result.score;
      } else {
        // vaihe 11 suorittaa minimaxrekusrio uudella laudella
        const result = minimax(currBdSt, aiMark);

        // vaihe 12 tallen tulosken pisteytys currentTestPlayInfo objetiin
        currentTestPlayInfo.score = result.score;
      }
      // vaihe 12 palautta lauta aiempien tilaan
      currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;

      // vaihe 12 talenne testatun  siiroon tulos myöhempää käyttöä varten
      allTestPlayInfos.push(currentTestPlayInfo);
    }

    // vaihe 15 luo muuttuija parhan siirron tallentamiseen
    let bestTestPlay = null;

    // vaihe 16 etsi paras siirto nykyisella pelaajalle
    if (currMark === aiMark) {
      let bestScore = -Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score > bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < allTestPlayInfos.length; i++) {
        if (allTestPlayInfos[i].score < bestScore) {
          bestScore = allTestPlayInfos[i].score;
          bestTestPlay = i;
        }
      }
    }

    // vaihe 17 palauttaa apras siirto nykysille pelaajalle
    return allTestPlayInfos[bestTestPlay];
  }
  // vaihe 7 ensimäinen minimax ktsu
  const bestPlayInfo = minimax(currentBoardState, aiMark);

  // vaihe 25 Suorita siirto parhaaseen mahdolliseen ruutuun:
  gameCells[bestPlayInfo.index].innerText = aiMark;
}

// vaihe 26 tarkistetaan onko peli ohi:
function checkIfGameIsOver() {
  const rowsColsAndDiagsKeys = [
    'rowOne',
    'rowTwo',
    'rowThree',
    'columnOne',
    'columnTwo',
    'columnThree',
    'diagonalOne',
    'diagonalTwo',
  ];

  const rowsColsAndDiags = {
    rowOne: document.querySelectorAll('.r1'),
    rowTwo: document.querySelectorAll('.r2'),
    rowThree: document.querySelectorAll('.r3'),
    columnOne: document.querySelectorAll('.c1'),
    columnTwo: document.querySelectorAll('.c2'),
    columnThree: document.querySelectorAll('.c3'),
    diagonalOne: document.querySelectorAll('.d1'),
    diagonalTwo: document.querySelectorAll('.d2'),
  };

  const cellValuesKeys = [
    'rowOneCellsValues',
    'rowTwoCellsValues',
    'rowThreeCellsValues',
    'columnOneCellsValues',
    'columnTwoCellsValues',
    'columnThreeCellsValues',
    'diagonalOneCellsValues',
    'diagonalTwoCellsValues',
  ];

  const cellValues = {
    rowOneCellsValues: [],
    rowTwoCellsValues: [],
    rowThreeCellsValues: [],
    columnOneCellsValues: [],
    columnTwoCellsValues: [],
    columnThreeCellsValues: [],
    diagonalOneCellsValues: [],
    diagonalTwoCellsValues: [],
  };

  // lisää jokaisen rivin, sarakkeen ja lävistäjän arvot vastaavaan taulukkoon
  for (let i = 0; i < rowsColsAndDiagsKeys.length; i++) {
    rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach((c) =>
      cellValues[cellValuesKeys[i]].push(c.innerText)
    );
  }

  // muut voitoorivirn väriksi vihreä
  for (let i = 0; i < cellValuesKeys.length; i++) {
    if (
      cellValues[cellValuesKeys[i]].every(
        (v) => v === cellValues[cellValuesKeys[i]][0] && v !== ''
      )
    ) {
      gameOver = true;
      rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(
        (c) => (c.style.color = 'green')
      );
    }
  }

  // If all cells have a value ("X" or "O"), and gameOver is still "false", change the gameOver variable to "true" and change all cells' font color to grey to reflect that the game is a draw:
  if (Array.from(gameCells).every((i) => i.innerText) && !gameOver) {
    gameOver = true;
    gameCells.forEach((i) => (i.style.color = 'grey'));
  }
}
