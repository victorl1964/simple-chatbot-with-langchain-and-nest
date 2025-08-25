import { Injectable } from '@nestjs/common';
import { ChatbotPromptDto } from './dto/chatbot-prompt.dto';
import { ChatOllama } from '@langchain/community/chat_models/ollama';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

import { EnvironmentService } from '../environment/environment.service'; // <-- Import the service

@Injectable()
export class ChatbotService {
  private ollamaChatModel: ChatOllama;
  constructor(
    //private readonly configService: ConfigService,
    private readonly environmentService: EnvironmentService,
  ) {
    this.ollamaChatModel = new ChatOllama({
      baseUrl: this.environmentService.getOllamaURL(), // Make sure this URL is correct for your Ollama server
      model: this.environmentService.getOllamaModel(), // Or the name of your desired Ollama model
    });
  }
  async getChatbotResponse(chatbotPromptDto: ChatbotPromptDto) {
    // Create the user message with language context if provided
    let userMessage = chatbotPromptDto.message;
    if (chatbotPromptDto.language && chatbotPromptDto.language !== 'auto') {
      userMessage = `Programming language: ${chatbotPromptDto.language}\n\n${chatbotPromptDto.message}`;
    }

    // Create messages array with system prompt and user message
    const messages = [
      new SystemMessage(this.environmentService.getSystemPrompt()),
      new HumanMessage(userMessage),
    ];

    // Get response from Ollama
    const response = await this.ollamaChatModel.invoke(messages);
    return {
      success: true,
      response: response.content,
      message: chatbotPromptDto.message,
      language: chatbotPromptDto.language || 'auto',
    };
  }

  healthcheck() {
    return 'CHATBOT API RUNNING OK...';
  }
}
