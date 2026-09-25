/* eslint-disable @typescript-eslint/no-floating-promises */
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import express from 'express';
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(cookieParser());

  const explicitOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.20.163:3000',
    'https://api-test.edl.com.la',
    process.env.FRONTEND_URL,
  ].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      // Check explicit origins
      if (explicitOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow any local network IP (localhost, 127.0.0.1, 10.x, 192.168.x, 172.16-31.x)
      const isLocalNetwork =
        /^https?:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/.test(
          origin,
        );

      if (isLocalNetwork) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
  });

  const uploadBasePath = process.env.UPLOAD_BASE_PATH;
  if (!uploadBasePath) {
    throw new Error('UPLOAD_BASE_PATH is not defined');
  }

  app.use('/upload', express.static(path.resolve(uploadBasePath)));

  const port = process.env.PORT || 7000;
  await app.listen(port);
}
bootstrap();
