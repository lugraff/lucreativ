import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RandomizerService {
  private numbers: number[] = [];
  private amount = 1000;

  constructor() {
    this.fillNumbers();
  }

  private fillNumbers(): void {
    this.numbers = [];
    for (let index = 0; index < this.amount; index++) {
      this.numbers.push((index + 1) / this.amount);
    }
  }

  public getNumber(): number {
    const randomNumber = Math.floor(Math.random() * this.numbers.length);
    const selectedNumber = this.numbers[randomNumber];
    this.numbers.splice(randomNumber, 1);
    if (this.numbers.length <= 0) {
      this.fillNumbers();
    }
    return selectedNumber;
  }
}
