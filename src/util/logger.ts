/* eslint-disable no-console */
import { Colors } from './consts';

/**
 * Enum for logger LogLevel.
 * @readonly
 * @enum {string}
 */
export const enum LogLevel {
  Debug = 'Debug', // only enable in development env
  Info = 'Info', // get to stdout
  Warn = 'Warn', // get to stderr
  Error = 'Error', // get to stderr
}

/**
 * Custom Logger
 */
class Logger {
  private componentName: string;

  /**
   * create a new Logger
   * @param {string} componentName Name of component
   */
  constructor(componentName: string) {
    this.componentName = componentName;
  }

  /**
   * private internal log function
   */
  private static log(level: LogLevel, componentName: string, message: any): void {
    const time = new Date();
    let color = Colors.FgWhite;
    switch (level) {
      case LogLevel.Debug:
        color = Colors.FgCyan;
        break;
      case LogLevel.Info:
        color = Colors.FgGreen;
        break;
      case LogLevel.Warn:
        color = Colors.FgYellow;
        break;
      case LogLevel.Error:
        color = Colors.FgRed;
        break;
      default:
        color = Colors.FgWhite;
        break;
    }
    console.log(
      `${time.toISOString()} - ${color}[${level}][${componentName}]${message}${Colors.Reset}`
    );
  }

  static raw(message: any): void {
    if (typeof message === 'object') {
      console.log(JSON.stringify(message));
    } else {
      console.log(message);
    }
  }

  info(message: any): void {
    Logger.log(LogLevel.Info, this.componentName, message);
  }

  error(message: any): void {
    Logger.log(LogLevel.Error, this.componentName, message);
  }

  debug(message: any): void {
    Logger.log(LogLevel.Debug, this.componentName, message);
  }

  warn(message: any): void {
    Logger.log(LogLevel.Warn, this.componentName, message);
  }
}

const getLogger = (componentName: string): Logger => new Logger(componentName);

export default getLogger;
