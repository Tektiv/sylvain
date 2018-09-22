class Attribute {
  constructor(name, value = 10, modificator = 0, savingThrow = false) {
    this.name = name;
    this.value = value;
    this.modificator = modificator;
    this.savingThrow = savingThrow;
  }

  getModificator() {
    return this.modificator;
  }
}

class Skill {
  constructor(name, attribute, proficiency = false) {
    this.name = name;
    this.attribute = attribute;
    this.proficiency = proficiency;
  }

  getModificator() {
    return this.attribute.modificator + (this.proficiency ? 2 : 0);
  }
}

exports.Attribute = Attribute;
exports.Skill = Skill;
