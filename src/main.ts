import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import redoc from 'redoc-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.log(errors);
        return new BadRequestException(
          errors.map((error) => Object.values(error.constraints).join(', ')),
        );
      },
    }),
  );

  const isDebug = configService.get<string>('IS_DEBUG') == 'true';

  if (isDebug) {
    const config = new DocumentBuilder()
      .setTitle('Cracker Service')
      .setDescription('API untuk service Cracker')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    const redocOptions = {
      title: 'Cracker Service',
      version: '1.0',
      specUrl: '/api-json',
    };

    app.use('/docs', redoc(redocOptions));
  }

  await app.listen(14100);
}
bootstrap();
