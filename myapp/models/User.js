class User {
  constructor(
    { id = -1, name, dob, address, description, createdAt = new Date() }) {
    this.id = id;
    this.name = name;
    this.dob = dob;
    this.address = address;
    this.description = description;
    this.createdAt = createdAt;
  }

  toString() {
    if (this.id == -1) {
      return `name=${this.name}, dob=${this.dob}, ` +
        `address=${this.address}, description=${this.description}`;
    } else {
      return `[id=${this.id}, name=${this.name}, dob=${this.dob}, ` +
        `address=${this.address}, description=${this.description}, ` +
        `createdAt=${this.createdAt}]`;
    }
  }
}

module.exports = User;