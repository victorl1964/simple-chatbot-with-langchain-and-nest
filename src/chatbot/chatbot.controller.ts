import { Controller, Get, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { ChatbotPromptDto } from './dto/chatbot-prompt.dto';

@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('/message')
  getChatbotResponse(@Body() chatbotPromptDto: ChatbotPromptDto) {
    return this.chatbotService.getChatbotResponse(chatbotPromptDto);
  }

  @Get('/_healthcheck')
  health() {
    return this.chatbotService.healthcheck();
  }
}
