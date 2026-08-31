import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)

  if(configService.get<string>("NODE_ENV", "development") != "production")
    app.enableCors({origin: "http://localhost:5173", credentials: true})


  app.use(cookieParser())

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))
  app.setGlobalPrefix("api")

  

  await app.listen(parseInt(process.env.PORT!));
}
bootstrap();
