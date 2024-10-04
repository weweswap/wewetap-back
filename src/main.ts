import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { User } from './users/users.model';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  User.sync({ alter: true });

  const config = new DocumentBuilder()
    .setTitle('WeTap Api')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  await app.listen(5000);
}

bootstrap();
