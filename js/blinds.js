function setBlinds(allPlayers, pot, numBlindTurn) {
  let smallBlind = 1;
  let bigBlind = 5;
  let blindsTotal = smallBlind + bigBlind;

  let numPlayers = allPlayers.length;
  let bigBlindPlayer = allPlayers[numBlindTurn % numPlayers];
  let smallBlindPlayer = allPlayers[(numBlindTurn + 1) % numPlayers];

  bigBlindPlayer.setMoney(bigBlindPlayer.getMoney() - bigBlind);
  smallBlindPlayer.setMoney(smallBlindPlayer.getMoney() - smallBlind);

  pot += blindsTotal;

  numBlindTurn++; // Maybe change to turn for main game cycle

  // Remove existing blind markers before appending new ones
  removeBlindMarkers();

  // Append new blind markers
  appendBlindMarkers(bigBlindPlayer, smallBlindPlayer);

  return pot;
}

function removeBlindMarkers() {
  const blindLabels = document.querySelectorAll('.blind-label');
  blindLabels.forEach((label) => label.remove());
}

function appendBlindMarkers(bigBlindPlayer, smallBlindPlayer) {
  const bbDiv = document.createElement('div');
  const bbSpan = document.createElement('span');
  bbDiv.className = 'blind-label';
  bbSpan.className = 'big-blind';
  bbSpan.textContent = 'BB';

  bbDiv.appendChild(bbSpan);

  const sbDiv = document.createElement('div');
  const sbSpan = document.createElement('span');
  sbDiv.className = 'blind-label';
  sbSpan.className = 'small-blind';
  sbSpan.textContent = 'SB';

  sbDiv.appendChild(sbSpan);

  const bigBlindPlayerContainer = document.getElementById(
    `${bigBlindPlayer.getName()}-container`
  );

  const smallBlindPlayerContainer = document.getElementById(
    `${smallBlindPlayer.getName()}-container`
  );

  bigBlindPlayerContainer.appendChild(bbDiv);
  smallBlindPlayerContainer.appendChild(sbDiv);
}

export { setBlinds };
