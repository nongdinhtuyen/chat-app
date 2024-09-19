import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './https/auth/auth.module';
import { UsersModule } from './https/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksModule } from './https/tasks/tasks.module';
import type { Connection } from 'mongoose';
import { RolesModule } from './https/roles/roles.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsModule } from './https/permissions/permissions.module';
import { JwtAuthGuard } from './https/auth/passport/jwt-auth.guard';
import { JwtStrategy } from './https/auth/passport/jwt.strategy';
import { HealthModule } from './https/health/health.module';
import { CustomersModule } from './https/customers/customers.module';
import { ChatsModule } from './https/chat/chat.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChannelModule } from './https/channel/channel.module';
import { ChatController } from './https/chat/chat.controller';

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
    // ThrottlerModule.forRoot([
    // {
    //   ttl: 60000,
    //   limit: 10,
    // },
    // ]),
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
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
})
export class AppModule {}
