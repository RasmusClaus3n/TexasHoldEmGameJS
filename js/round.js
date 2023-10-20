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
}

export { setBlinds };
