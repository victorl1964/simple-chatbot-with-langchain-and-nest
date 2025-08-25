import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ChatbotModule } from './chatbot/chatbot.module';
import { EnvConfiguration } from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { EnvironmentModule } from './environment/environment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration], //this file MAPS .env vars into an Object
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ChatbotModule,
    EnvironmentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
