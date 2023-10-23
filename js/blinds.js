function setBlinds(allPlayers, bm) {
  let smallBlind = bm.getSmallBlind();
  let bigBlind = bm.getBigBlind();
  let blindsTotal = smallBlind + bigBlind;

  let blindTurn = bm.getBlindTurn();

  let numPlayers = allPlayers.length;
  let smallBlindPlayer = allPlayers[blindTurn % numPlayers];
  let bigBlindPlayer = allPlayers[(blindTurn + 1) % numPlayers];

  bigBlindPlayer.setMoney(bigBlindPlayer.getMoney() - bigBlind);
  smallBlindPlayer.setMoney(smallBlindPlayer.getMoney() - smallBlind);

  bm.addToPot(blindsTotal);

  bm.increaseBlindTurn(1);

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
