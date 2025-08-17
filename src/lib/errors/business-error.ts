// Business error sınıfları

import { SHARED_SYSTEM } from '@/lib/constants';

// Temel business error sınıfı
export class BusinessError extends Error {
    public readonly code: string;
    public readonly details?: Record<string, unknown>;

    constructor(
        message: string,
        code: string = SHARED_SYSTEM.ERROR_CODES.UNKNOWN_ERROR,
        details?: Record<string, unknown>
    ) {
        super(message);
        this.name = 'BusinessError';
        this.code = code;
        this.details = details;

        // Error stack trace için
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, BusinessError);
        }
    }
}

// HTTP 404 - Kaynak bulunamadı
export class NotFoundError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.NOT_FOUND, details);
        this.name = 'NotFoundError';
    }
}

// HTTP 401/403 - Yetkilendirme hatası
export class UnauthorizedError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.UNAUTHORIZED, details);
        this.name = 'UnauthorizedError';
    }
}

// HTTP 409 - Çakışma hatası
export class ConflictError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.CONFLICT, details);
        this.name = 'ConflictError';
    }
}

// HTTP 429 - Rate limit hatası
export class RateLimitExceededError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.RATE_LIMIT_EXCEEDED, details);
        this.name = 'RateLimitExceededError';
    }
}

// HTTP 400 - Geçersiz token
export class InvalidTokenError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.INVALID_TOKEN, details);
        this.name = 'InvalidTokenError';
    }
}

// HTTP 403 - Yasaklı kullanıcı
export class BannedUserError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.USER_BANNED, details);
        this.name = 'BannedUserError';
    }
}

// HTTP 502 - Dış servis hatası
export class ExternalServiceError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.EXTERNAL_SERVICE_ERROR, details);
        this.name = 'ExternalServiceError';
    }
}

// HTTP 500 - Veritabanı hatası (genel)
export class DatabaseError extends BusinessError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, SHARED_SYSTEM.ERROR_CODES.DATABASE_ERROR, details);
        this.name = 'DatabaseError';
    }
}

// HTTP 500 - Veritabanı bağlantı hatası
export class DatabaseConnectionError extends DatabaseError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, details);
        this.name = 'DatabaseConnectionError';
    }
}

// HTTP 500 - Veritabanı sorgu hatası
export class DatabaseQueryError extends DatabaseError {
    constructor(message: string, details?: Record<string, unknown>) {
        super(message, details);
        this.name = 'DatabaseQueryError';
    }
}