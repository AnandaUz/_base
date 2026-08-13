export class TimeLog {
  tTotal: Date | null = null;
  tPart: Date | null = null;
  constructor() {
    this.start();
  }

  start() {
    this.tTotal = new Date();
  }
  log(message: string) {
    if (!this.tTotal) return;
    const timeTotal = new Date().getTime() - this.tTotal.getTime();

    if (this.tPart) {
      const timePart = new Date().getTime() - this.tPart.getTime();
      console.log(`${message}: ${timePart} : ${timeTotal}`);
    } else {
      console.log(`${message}: ${timeTotal}`);
    }

    this.tPart = new Date();
  }
}

export class BTools {
  constructor() {}

  /** объект для отслеживания работы кода */
  static timeLog = new TimeLog();
}

// export const btools = new BTools();
