import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TransformInterceptor } from './core/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });
  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  const config = new DocumentBuilder()
    .setTitle('Doanxem')
    .setDescription('[JSON](http://localhost:8080/api-json/)')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(configService.get<string>('PORT'));
  const server = app.getHttpServer() as any;
  const router = server._events.request._router;

  // const availableRoutes: [] = router.stack
  //   .map((layer) => {
  //     if (layer.route) {
  //       return {
  //         path: layer.route?.path,
  //         method: layer.route?.stack[0].method,
  //       };
  //     }
  //   })
  //   .filter((item) => item !== undefined);
}
bootstrap();
