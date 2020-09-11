import { TransformableInfo } from "logform";
import TransportStream from "winston-transport";
import chalk from "chalk";

type Levels = "DEBUG" | "INFO" | "WARN" | "ERROR";

export class BrowserConsole extends TransportStream {
  constructor(options = {}) {
    super(options);
    this.setMaxListeners(30);
  }

  log(info: TransformableInfo, next: () => void): void {
    const chalkInst = new chalk.Instance({ level: 1 });
    const level = info.level.toUpperCase() as Levels;

    const colorString = (level: Levels) => {
      switch (level) {
        case "DEBUG":
          return chalkInst.blackBright(level);
        case "INFO":
          return chalkInst.blueBright(level);
        case "WARN":
          return chalkInst.yellow(level);
        case "ERROR":
          return chalkInst.magenta(level);
      }
    };
    console.log(`[${colorString(level)}]`, info);
    next();
  }
}
