Minimax-algoritmi: on rekursiivinen ohjelma, joka on kirjoitettu 
löytömään paras pelattavuuden, joka minimoi taipumksen hävitä peli 
ja maksimoi kaikki mahdollisuudet voittaa peli. Tällaisessa esityksessä 
puun juurisolmu on pelin nykyinen tila, jossa minimax-algoritmi kutsuttiin.


Rekursiivinen ohjelma: tarkoittaa funktio, joka kutsuu itseään suorittaakseen tehtävänsä.
Se jakaa ongelman pienempiin osiin ja ratkaisee ne toistuvasti, kunnes saavutetaan 
perusehto (base case), joka lopettaa rekursion.


tässä lopputyössä käyetetään tic-tac-toe-projektin luodamalla minimax-algoritmi script1.js, 
joka tekee tekoälystä lyömättömän.

x-merkki: edustaa tekoälyn merkkiä
o-merkki: edustaa ihmispelaaja merkkiä


Pelaajan maksimointi vs. minimoiminen mitä eroa niillä on?

  - Pelaajan maksimointi tarkoittaa strategiaa, jossa pelaaja pyrkii 
    maksimoimaan oman voittomahdollisuutensa.

  - Minimoiva pelaaja taas on vastustaja, joka pyrkii minimoimaan 
    maksimoijan menestymisen.


muutos projektissa eli oman datan kehittaminen eli script2.js:
  - tässä projektissa käyttän tensorfow.js-kirjastoa, joka tekee pelistä älykkäämpi ja 
    antaa tekoälyn oppia pelaajan siirroista parantaakseen strategiaansa ajan myötä.

  - Korvaan minimax-algoritmin neuroverkolla, joka oppii ja kouluttaa pelaajan liikkeistä.

  - 

Miten tekoäly päättää seuraavan siirtonsa tässä pelissä?
  - tekoälyn valitsee oma siirtoja neuroverkomallin avulla, joka on luotu tensorfow.js kirjastolla



Miten peli tunnistaa, milloin joku on voittanut tai peli päättyy tasapeliin?
 - checkIsGameOver()-funktiolla

Mikä on syy valita localstorage mallin tallentamiseen?
  - on se, että se mahdollistaa mallin tallentamisen ja lataamisen suoraan selaimessa 
    ilman tarvetta palvelimelle. Tämä tekee projektista itsenäisen ja mahdollistaa mallin 
    käyttämisen ilman verkon kautta tapahtuvaa tiedonsiirtoa.


Koodissa luodaan perusneuroverkko, jossa on kaksi tiheää kerrosta. Miten aiot kouluttaa tämän mallin?
  - Neuroverkon koulutus tässä koodissa en ole vielä täysin selkeä, koska en ole vielä esittänyt, 
    miten peliä pelataan koulutusvaiheessa. Malli luotaan ja tallennetaan, mutta se ei 
    vielä opi jatkuvasti pelin aikana. Kouluttaminen voisi tapahtua keräämällä peliin 
    liittyvää dataa (pelaajan ja AI:n siirtoja).


TensorFlow.js -mallin kouluttaminen vaatii, että se on ensin käännetty 
käyttämällä compile()-metodia ennen kuin mallia voi käyttää oppimiseen.
