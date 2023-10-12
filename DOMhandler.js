const comCardsDiv = document.querySelector('.community-cards');
const playerCardsDiv = document.querySelector('.player-cards');

const cpuPlayersRowDiv = document.querySelector('.cpu-players-row');

const mainPlayerHandRankName = document
  .getElementById('mp-hand-rank-name')
  .querySelector('h3');
const pkrBtn = document.querySelector('.pkr-btn button');

function displayToDOM(comCards, mainPlayer, cpuPlayers) {
  comCardsDiv.innerHTML = '';
  playerCardsDiv.innerHTML = '';
  cpuPlayersRowDiv.innerHTML = '';

  for (let card of comCards) {
    const pokerCardImg = createPokerCardImg(card);
    comCardsDiv.appendChild(pokerCardImg);
  }

  for (let i = 1; i < 6 - comCards.length; i++) {
    let backCardImg = createBackCardImg();
    comCardsDiv.appendChild(backCardImg);
  }

  for (let card of mainPlayer.getHand()) {
    let pokerCardImg = createPokerCardImg(card);
    playerCardsDiv.appendChild(pokerCardImg);
  }

  for (const cpu of cpuPlayers) {
    createCpuDivs(cpu, cpuPlayersRowDiv);
  }

  mainPlayerHandRankName.textContent = mainPlayer.getHandRankName();
}

function createPokerCardImg(card) {
  let pokerCardImg = document.createElement('img');
  pokerCardImg.className = 'poker-card';
  pokerCardImg.src = `./cardImages/${card.getName()}.png`;
  pokerCardImg.alt = '';

  return pokerCardImg;
}

function createBackCardImg() {
  let backCardImg = document.createElement('img');
  backCardImg.className = 'poker-card';
  backCardImg.src = './cardImages/back_blue.png';
  backCardImg.alt = '';

  return backCardImg;
}

function createCpuDivs(cpu, cpuPlayersRowDiv) {
  const cpuId = cpu.getName();

  const cpuColDiv = document.createElement('div');
  cpuColDiv.className = 'cpu-col';
  cpuColDiv.id = cpuId;

  const cpuCardsDiv = document.createElement('div');
  cpuCardsDiv.className = 'cpu-cards';
  cpuCardsDiv.id = `${cpuId}-cards`;

  const playerName = document.createElement('div');
  playerName.className = 'player-name';
  playerName.id = `${cpuId}-name`;

  const playerNameText = document.createElement('h3');
  playerNameText.textContent = cpuId;

  const playerHandRank = document.createElement('div');
  playerHandRank.className = 'player-hand-rank';
  playerHandRank.id = `${cpuId}-rank`;

  const playerHandRankText = document.createElement('h3');
  playerHandRankText.textContent = cpu.getHandRankName();

  playerHandRank.appendChild(playerHandRankText);

  cpuPlayersRowDiv.appendChild(cpuColDiv);

  cpuColDiv.appendChild(playerName);
  playerName.appendChild(playerNameText);
  cpuColDiv.appendChild(cpuCardsDiv);
  cpuColDiv.appendChild(playerHandRank);

  for (let card of cpu.getHand()) {
    let pokerCardImg = createPokerCardImg(card);
    document.getElementById(`${cpuId}-cards`).appendChild(pokerCardImg);
  }
}

function createHandRankNames() {}

export { displayToDOM };
