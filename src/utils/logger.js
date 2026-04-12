/**
 * Logger simple pour les microservices
 */
export class Logger {
  constructor(serviceName = 'API') {
    this.serviceName = serviceName;
  }

  /**
   * Log d'information
   */
  info(message, data = null) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${this.serviceName}] ${message}`, data ? JSON.stringify(data) : '');
  }

  /**
   * Log d'erreur
   */
  error(message, error = null) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${this.serviceName}] ${message}`, error || '');
  }

  /**
   * Log d'avertissement
   */
  warn(message, data = null) {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${this.serviceName}] ${message}`, data ? JSON.stringify(data) : '');
  }

  /**
   * Log de debug
   */
  debug(message, data = null) {
    if (process.env.DEBUG === 'true') {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [DEBUG] [${this.serviceName}] ${message}`, data ? JSON.stringify(data) : '');
    }
  }
}
