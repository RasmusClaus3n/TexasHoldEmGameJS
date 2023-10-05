class Card {
  constructor(suite, value, name) {
    this.suite = suite;
    this.value = value;
    this.name = name;
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  getSuite() {
    return this.suite;
  }

  setSuite(suite) {
    this.suite = suite;
  }

  getName() {
    return this.name;
  }

  setName(name) {
    this.name = name;
  }
}

export default Card;
