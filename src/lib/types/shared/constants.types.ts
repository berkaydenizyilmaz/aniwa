// Shared constants utility types

// Generic domain type extraction
export type DomainType<T> = keyof T;
export type DomainStatus<T> = keyof T;
export type DomainCategory<T> = keyof T;

// Validation constants types
export type ValidationRule<T> = {
  MIN_LENGTH?: number;
  MAX_LENGTH?: number;
  PATTERN?: string;
} & T;

// UI constants types
export type UiLabels<T> = Record<keyof T, string>;
export type UiColors<T> = Record<keyof T, string>;
export type UiSizes<T> = Record<keyof T, string>;

// Business constants types
export type BusinessRule<T> = {
  PAGINATION?: {
    MIN_PAGE: number;
    MAX_LIMIT: number;
    DEFAULT_LIMIT: number;
  };
} & T;

// Domain constants structure
export type DomainConstants<T> = {
  VALIDATION?: T;
  BUSINESS?: T;
  UI?: T;
};
