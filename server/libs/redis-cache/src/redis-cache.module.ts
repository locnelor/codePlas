

import { Global, Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { Redis } from 'ioredis';
import { RedisCacheService } from './redis-cache.service';

@Global()
@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: "single",
        options: {
          host: config.get("REDIS_HOST"),
          port: config.get("REDIS_PORT"),
          password: config.get("REDIS_PASSWORD"),
          db: config.get<number>("REDIS_DB", 0),
          // tls: config.get<boolean>("REDIS_TLS", false) ? {} : undefined, 
        },
      }),
    }),
  ],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {
  private static redisClient: Redis | null = null;

  static getRedisClient() {
    if (!this.redisClient) {
      const configService = new ConfigService();
      const host = configService.get<string>('REDIS_HOST');
      const port = configService.get<number>('REDIS_PORT');
      const password = configService.get<string>('REDIS_PASSWORD');
      const db = configService.get<number>('REDIS_DB', 0);

      this.redisClient = new Redis({
        host,
        port,
        password,
        db,
        retryStrategy: (times) => Math.min(times * 50, 2000),
      });

      this.redisClient.on('connect', () => {
        console.log('Redis connected');
      });

      this.redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
      });

      this.redisClient.on('close', () => {
        console.log('Redis connection closed');
      });
    }
    return this.redisClient;
  }
}