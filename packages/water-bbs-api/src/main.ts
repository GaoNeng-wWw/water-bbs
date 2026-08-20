import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpPresentationError } from '@app/shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));

  const config = new DocumentBuilder()
    .setTitle('API Example')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addTag('example')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [HttpPresentationError],
  });
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3100);
}
bootstrap();
