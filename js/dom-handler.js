const comCardsDiv = document.querySelector('.community-cards');
const playerCardsDiv = document.querySelector('.player-cards');

const cpuPlayersRowDiv = document.querySelector('.cpu-players-row');

const mainPlayerHandRankName = document
  .getElementById('mp-hand-rank-name')
  .querySelector('p');
const pkrBtn = document.querySelector('.pkr-btn button');

function displayToDOM(mainPlayer, cpuPlayers, comCards) {
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

  const cpuContainer = document.createElement('div');
  cpuContainer.className = 'player-container nes-container is-dark with-title';

  const title = document.createElement('p');
  title.className = 'title';
  title.textContent = `${cpuId} \$${cpu.getMoney()} `;

  const playerContent = document.createElement('div');
  playerContent.className = 'player-content';

  const cpuCardsDiv = document.createElement('div');
  cpuCardsDiv.className = 'player-cards';

  const playerHandRank = document.createElement('div');
  playerHandRank.className = 'player-hand-rank';
  playerHandRank.id = `${cpuId}-rank`;

  const playerHandRankText = document.createElement('p');
  playerHandRankText.textContent = cpu.getHandRankName();

  playerHandRank.appendChild(playerHandRankText);

  cpuContainer.appendChild(title);
  cpuContainer.appendChild(playerContent);
  cpuPlayersRowDiv.appendChild(cpuContainer);

  playerContent.appendChild(cpuCardsDiv);
  playerContent.appendChild(playerHandRank);

  for (let card of cpu.getHand()) {
    let pokerCardImg = createPokerCardImg(card);
    cpuCardsDiv.appendChild(pokerCardImg);
  }
}

function createHandRankNames() {}

export { displayToDOM };
