export class Logger {
  static error(context: any, action: string, error: any) {
    console.error(`Context: ${context}, Action: ${action}, Error: ${error}`);
  }
}
