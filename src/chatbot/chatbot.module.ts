import { Module } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotController } from './chatbot.controller';
import { EnvironmentModule } from '../environment/environment.module';
//import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [EnvironmentModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  //imports: [ConfigModule],   NO NEED BECAUSE ConfigModule was mada available GLOBALLY in app.module.ts
})
export class ChatbotModule {}
