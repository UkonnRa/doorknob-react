import { TransformableInfo } from "logform";
import TransportStream from "winston-transport";

enum LevelColors {
  INFO = "darkturquoise",
  WARN = "khaki",
  ERROR = "tomato",
}

type Levels = "INFO" | "WARN" | "ERROR";

const defaultColor = "color: inherit";

export class BrowserConsole extends TransportStream {
  constructor(options = {}) {
    super(options);
    this.setMaxListeners(30);
  }

  log(info: TransformableInfo, next: () => void): void {
    const data = Object.entries(info).filter(
      ([k]) => k !== "level" && k !== "message"
    );

    if (data.length > 0) {
      console.log(
        `%c[%c${info.level.toUpperCase()}%c]:`,
        defaultColor,
        `color: ${LevelColors[info.level.toUpperCase() as Levels]};`,
        defaultColor,
        info.message,
        Object.fromEntries(data)
      );
    } else {
      console.log(
        `%c[%c${info.level.toUpperCase()}%c]:`,
        defaultColor,
        `color: ${LevelColors[info.level.toUpperCase() as Levels]};`,
        defaultColor,
        info.message
      );
    }

    next();
  }
}
