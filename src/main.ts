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

  const allowedOrigins = [
    'http://localhost:3000',
    'http://192.168.20.163:3000',
    'https://api-test.edl.com.la',
  ];

  app.enableCors({
    origin: allowedOrigins,
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
