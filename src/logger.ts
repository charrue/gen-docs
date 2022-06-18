import {
  bold,
  dim,
  green,
  red,
  yellow,
  cyan,
} from "kolorist";
export type LogType = "error" | "warn" | "info" | "success";
export type LogLevel = LogType | "silent";

export interface LogOptions {
  /**
   * 输出之前清屏
   */
  clear?: boolean;
  /**
   * 输出的内容是否带有颜色
   */
  color?: boolean;
  timestamp?: boolean;
}

export interface LoggerOptions {
  prefix?: string;
  allowClearScreen?: boolean;
}

export interface Logger {
  success(msg: string, options?: LogOptions): void;
  info(msg: string, options?: LogOptions): void;
  warn(msg: string, options?: LogOptions): void;
  error(msg: string, options?: LogOptions): void;
  clearScreen(msg: string, options?: LogOptions): void;
}

const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  success: 3,
};

const colorizeHandler = {
  success: green,
  error: red,
  warn: yellow,
  info: cyan,
};
const colorizeMessage = (message: string, type?: LogType) => {
  if (type && colorizeHandler[type]) {
    return colorizeHandler[type](message);
  }
  return message;
};

const clearScreen = () => {
  console.clear();
};

function createLogger(level: LogLevel = "info", loggerOptions: LoggerOptions = {}): Logger {
  const { prefix = "", allowClearScreen = true } = loggerOptions;
  const thresh = LogLevels[level];
  const clear = allowClearScreen
    ? clearScreen
    : () => {
      //
    };

  function output(type: LogType, msg: string, outputOptions: LogOptions = {}) {
    const { color = true, timestamp = false, clear: shouldClear = false } = outputOptions;
    // 如果手动调用的日志级别比设置的日志级别低，则不输出
    if (thresh >= LogLevels[type]) {
      const method = (type === "info" || type === "success") ? "log" : type;
      const format = () => {
        if (timestamp) {
          return `${dim(new Date().toLocaleTimeString())} ${colorizeMessage(
            bold(prefix),
            type,
          )} ${msg}`;
        }
        return colorizeMessage(msg, color ? type : undefined);
      };
      if (allowClearScreen) {
        if (shouldClear) {
          clear();
        }
        console[method].call(null, format());
      } else {
        console[method].call(null, format());
      }
    }
  }

  const logger: Logger = {
    info(msg, opts) {
      output("info", msg, opts);
    },
    warn(msg, opts) {
      output("warn", msg, opts);
    },
    error(msg, opts) {
      output("error", msg, opts);
    },
    success(msg, opts) {
      output("success", msg, opts);
    },
    clearScreen(type: LogLevel) {
      if (thresh >= LogLevels[type]) {
        clear();
      }
    },
  };

  return logger;
}

export const logger = createLogger("info", {
  allowClearScreen: true,
  prefix: "[charrue-docs]",
});
