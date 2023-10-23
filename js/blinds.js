function setBlinds(allPlayers, bettingManager) {
  let smallBlind = bettingManager.getSmallBlind();
  let bigBlind = bettingManager.getBigBlind();
  let blindsTotal = smallBlind + bigBlind;

  let blindTurn = bettingManager.getBlindTurn();

  let numPlayers = allPlayers.length;
  let bigBlindPlayer = allPlayers[blindTurn % numPlayers];
  let smallBlindPlayer = allPlayers[(blindTurn + 1) % numPlayers];

  bigBlindPlayer.setMoney(bigBlindPlayer.getMoney() - bigBlind);
  smallBlindPlayer.setMoney(smallBlindPlayer.getMoney() - smallBlind);

  bettingManager.addToPot(blindsTotal);

  bettingManager.increaseBlindTurn(1);

  removeBlindMarkers();
  appendBlindMarkers(bigBlindPlayer, smallBlindPlayer);
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
