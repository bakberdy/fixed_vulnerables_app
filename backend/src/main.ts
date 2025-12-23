import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import Database from 'better-sqlite3';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';

const SqliteStore = require('better-sqlite3-session-store')(session);

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'cert.pem')),
  };

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
          frameAncestors: ["'none'"],
          upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      noSniff: true,
      xssFilter: true,
      hidePoweredBy: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    }),
  );

  app.useStaticAssets(path.join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        'https://localhost:5173',
        'http://localhost:5174',
        'https://localhost:5174',
        'http://localhost:5175',
        'https://localhost:5175',
        'http://localhost:5176',
        'https://localhost:5176',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  app.use(cookieParser());

  const dbPath = process.env.DATABASE_URL || './data/app.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  app.use(
    session({
      store: new SqliteStore({
        client: db,
        expired: {
          clear: true,
          intervalMs: 900000,
        },
      }),
      secret: process.env.SESSION_SECRET || 'insecure-secret-for-demo',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
      },
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('FreelancePro API')
    .setDescription('API for FreelancePro platform')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('users', 'User management')
    .addCookieAuth('connect.sid', {
      type: 'apiKey',
      in: 'cookie',
      name: 'connect.sid',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: https://localhost:${port}/api`);
  console.log(`Swagger API docs: https://localhost:${port}/api/docs`);
  console.log(`HTTPS enabled with self-signed certificates`);
}
bootstrap();
