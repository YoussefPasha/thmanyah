import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  
  // iTunes API Configuration
  itunesApiUrl: process.env.ITUNES_API_URL || 'https://itunes.apple.com',
  itunesApiTimeout: parseInt(process.env.ITUNES_API_TIMEOUT, 10) || 10000,
  itunesApiRetryAttempts: parseInt(process.env.ITUNES_API_RETRY_ATTEMPTS, 10) || 3,
  itunesApiRetryDelay: parseInt(process.env.ITUNES_API_RETRY_DELAY, 10) || 1000,
  
  // Rate Limiting
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL, 10) || 60,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'debug',
  
  // Security
  helmetEnabled: process.env.HELMET_ENABLED === 'true',
  compressionEnabled: process.env.COMPRESSION_ENABLED === 'true',
}));

