class PlayerTurnQueue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }

  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    return item + ' inserted';
  }

  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  getCurrentPlayer() {
    return this.items[this.frontIndex];
  }

  get printQueue() {
    return this.items;
  }
}

export default PlayerTurnQueue;
