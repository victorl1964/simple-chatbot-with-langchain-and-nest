// src/environment/environment.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvironmentService {
  constructor(private readonly configService: ConfigService) {}

  public getOllamaModel() {
    return this.configService.get<string>('ollamaModel');
  }

  public getOllamaURL() {
    return this.configService.get<string>('ollamaURL');
  }

  public getSystemPrompt(): string {
    return `You are an expert programming assistant specialized in helping developers with code. 
  Follow these guidelines strictly:
  1. Always respond with well-formatted code when appropriate
  2. Include code blocks with proper syntax highlighting markers
  3. Explain your reasoning briefly before providing code solutions
  4. Support all major programming languages
  5. Write clean, efficient, and modern code
  6. If the user doesn't specify a language, ask for clarification
  7. Provide complete solutions, not just snippets, when appropriate`;
  }
}
