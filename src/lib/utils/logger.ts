// Logger utility - Console ve Database logging
import { LogLevel } from '@prisma/client';
import { createLogSchema } from '@/lib/schemas/log.schema';

// Console renkleri
const CONSOLE_COLORS = {
  ERROR: '\x1b[31m', // Kırmızı
  WARN: '\x1b[33m',  // Sarı
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'   // Reset
} as const;

// Metadata tipi
type LogMetadata = Record<string, unknown> | null;

// Logger sınıfı
class Logger {
  private formatMessage(level: LogLevel, message: string, metadata?: LogMetadata): string {
    const timestamp = new Date().toISOString();
    const color = CONSOLE_COLORS[level as keyof typeof CONSOLE_COLORS] || CONSOLE_COLORS.RESET;
    const reset = CONSOLE_COLORS.RESET;
    
    let formattedMessage = `${color}[${level}]${reset} ${timestamp} - ${message}`;
    
    if (metadata && Object.keys(metadata).length > 0) {
      formattedMessage += ` ${reset}${JSON.stringify(metadata, null, 2)}`;
    }
    
    return formattedMessage;
  }

  private async saveToDatabase(
    level: LogLevel, 
    event: string, 
    message: string, 
    metadata?: LogMetadata,
    userId?: string
  ): Promise<void> {
    try {
      // Schema validation
      const logData = createLogSchema.parse({
        level,
        event,
        message,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
        userId
      });

      // Business layer üzerinden log oluştur
      const { createLogBusiness } = await import('@/lib/services/business/log.business');
      await createLogBusiness(logData);
    } catch (error) {
      // Database'e kaydedilemezse sadece console'a yaz
      console.error('Failed to save log to database:', error);
    }
  }

  // Info log
  async info(event: string, message: string, metadata?: LogMetadata, userId?: string): Promise<void> {
    const formattedMessage = this.formatMessage(LogLevel.INFO, message, metadata);
    console.log(formattedMessage);
    
    // Tüm info logları DB'ye kaydet
    await this.saveToDatabase(LogLevel.INFO, event, message, metadata, userId);
  }

  // Warning log
  async warn(event: string, message: string, metadata?: LogMetadata, userId?: string): Promise<void> {
    const formattedMessage = this.formatMessage(LogLevel.WARN, message, metadata);
    console.warn(formattedMessage);
    
    // Tüm warning'ler DB'ye kaydet
    await this.saveToDatabase(LogLevel.WARN, event, message, metadata, userId);
  }

  // Error log
  async error(event: string, message: string, metadata?: LogMetadata, userId?: string): Promise<void> {
    const formattedMessage = this.formatMessage(LogLevel.ERROR, message, metadata);
    console.error(formattedMessage);
    
    // Tüm error'lar DB'ye kaydet
    await this.saveToDatabase(LogLevel.ERROR, event, message, metadata, userId);
  }

  // Debug log (sadece development'ta)
  async debug(event: string, message: string, metadata?: LogMetadata): Promise<void> {
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = this.formatMessage(LogLevel.DEBUG, message, metadata);
      console.debug(formattedMessage);
    }
    
    // Debug logları DB'ye kaydetme
  }
}

// Singleton logger instance
export const logger = new Logger();

// Convenience fonksiyonları
export const logInfo = (event: string, message: string, metadata?: LogMetadata, userId?: string) => 
  logger.info(event, message, metadata, userId);

export const logWarn = (event: string, message: string, metadata?: LogMetadata, userId?: string) => 
  logger.warn(event, message, metadata, userId);

export const logError = (event: string, message: string, metadata?: LogMetadata, userId?: string) => 
  logger.error(event, message, metadata, userId);

export const logDebug = (event: string, message: string, metadata?: LogMetadata) => 
  logger.debug(event, message, metadata); 