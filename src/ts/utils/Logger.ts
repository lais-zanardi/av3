class Logger {
  private formatMessage(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const metaString = meta ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}`;
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage('INFO', message, meta));
  }

  error(message: string, error?: any) {
    console.error(this.formatMessage('ERROR', message), error);
  }

  security(message: string, meta?: { usuario?: string; id?: string; ip?: string; acao: string }) {
    console.warn(this.formatMessage('ZR-SECURITY', message, meta));
  }
}

export default new Logger();