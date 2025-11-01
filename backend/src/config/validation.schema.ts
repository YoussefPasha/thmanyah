import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),
  API_PREFIX: Joi.string().default('api/v1'),
  
  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().default(5432),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.boolean().default(false),
  DB_LOGGING: Joi.boolean().default(false),
  DB_SSL: Joi.boolean().default(false),
  DB_POOL_MIN: Joi.number().default(2),
  DB_POOL_MAX: Joi.number().default(10),
  
  // iTunes API
  ITUNES_API_URL: Joi.string().uri().default('https://itunes.apple.com'),
  ITUNES_API_TIMEOUT: Joi.number().default(10000),
  ITUNES_API_RETRY_ATTEMPTS: Joi.number().default(3),
  ITUNES_API_RETRY_DELAY: Joi.number().default(1000),
  
  // Rate Limiting
  RATE_LIMIT_TTL: Joi.number().default(60),
  RATE_LIMIT_MAX: Joi.number().default(100),
  
  // CORS
  CORS_ORIGIN: Joi.string().default('http://localhost:3001'),
  
  // Logging
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug').default('info'),
  
  // Security
  HELMET_ENABLED: Joi.boolean().default(true),
  COMPRESSION_ENABLED: Joi.boolean().default(true),
});

