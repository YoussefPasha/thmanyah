import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8080', 10),
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  
  // iTunes API Configuration
  itunesApiUrl: process.env.ITUNES_API_URL || 'https://itunes.apple.com',
  itunesApiTimeout: parseInt(process.env.ITUNES_API_TIMEOUT || '10000', 10),
  itunesApiRetryAttempts: parseInt(process.env.ITUNES_API_RETRY_ATTEMPTS || '3', 10),
  itunesApiRetryDelay: parseInt(process.env.ITUNES_API_RETRY_DELAY || '1000', 10),
  
  // Rate Limiting
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL || '60', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  
  // Security
  helmetEnabled: process.env.HELMET_ENABLED === 'true',
  compressionEnabled: process.env.COMPRESSION_ENABLED === 'true',
}));

