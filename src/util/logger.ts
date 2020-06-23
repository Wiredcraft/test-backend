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
class Logger<T> {
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
  private static log<T>(level: LogLevel, componentName: string, message: T): void {
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
      `${time.toISOString()} - ${color}[${level}][${componentName}]${
        typeof message === 'object' ? JSON.stringify(message) : message
      }${Colors.Reset}`
    );
  }

  static raw<T>(message: T): void {
    console.log(typeof message === 'object' ? JSON.stringify(message) : message);
  }

  info(message: T): void {
    Logger.log(LogLevel.Info, this.componentName, message);
  }

  error(message: T): void {
    Logger.log(LogLevel.Error, this.componentName, message);
  }

  debug(message: T): void {
    Logger.log(LogLevel.Debug, this.componentName, message);
  }

  warn(message: T): void {
    Logger.log(LogLevel.Warn, this.componentName, message);
  }
}

export const getLogger = <T>(componentName: string): Logger<T> => new Logger<T>(componentName);
