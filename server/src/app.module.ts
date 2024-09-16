import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './main/auth/auth.module';
import { UsersModule } from './main/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './main/tasks/tasks.module';
import type { Connection } from 'mongoose';
import { RolesModule } from './main/roles/roles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsModule } from './main/permissions/permissions.module';
import { JwtAuthGuard } from './main/auth/passport/jwt-auth.guard';
import { JwtStrategy } from './main/auth/passport/jwt.strategy';
import { HealthModule } from './main/health/health.module';
import { CustomersModule } from './main/customers/customers.module';
import { ChatsModule } from './main/chats/chats.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatsGateway } from './main/chats/chats.gateway';
import { ChannelModule } from './main/channel/channel.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'static'),
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        // useNewUrlParser: true,
        // useCreateIndex: true,
        connectionFactory(connection: Connection) {
          connection.plugin((schema) => {
            schema.set('toJSON', {
              versionKey: false,
              transform: (doc, ret) => {
                delete ret.__v;
              },
            });
          });
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    AuthModule,
    UsersModule,
    TasksModule,
    RolesModule,
    PermissionsModule,
    HealthModule,
    CustomersModule,
    ChatsModule,
    ChannelModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
