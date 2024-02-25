export class Bag {
    private _tagNumber: string;
  
    constructor();

    constructor(tagNumber?: string) {
      this._tagNumber = tagNumber || '';
    }
  
    // Getter for tagNumber
    get tagNumber(): string {
      return this._tagNumber;
    }
  
    // Setter for tagNumber
    set tagNumber(value: string) {
      this._tagNumber = value;
    }
  
}