class Address {
  constructor({ longtitude, latitude, description }) {
    this.longtitude = longtitude;
    this.latitude = latitude;
    this.description = description;
  }

  toString() {
    return `[longtitude=${this.longtitude}, latitude=${this.latitude}, description=${this.description}]`;
  }
}

module.exports = Address;