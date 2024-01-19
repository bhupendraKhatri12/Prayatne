import { Logger } from '@nestjs/common';
import * as fs from 'fs';

export class FileLogger extends Logger {
  private readonly logFile = require('./server.log.txt')

  log(message: string) {
    console.log("herr ====>",this.logFile, `${new Date().toISOString()} - ${message}\n`)
    fs.appendFileSync(this.logFile, `${new Date().toISOString()} - ${message}\n`);
  }
  error(message: any, stack?: string, context?: string) {
    // add your tailored logic here
    super.error(...arguments);
  }

}