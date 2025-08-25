import { IsString, MinLength } from 'class-validator';

export class ChatbotPromptDto {
  @IsString()
  @MinLength(1)
  message: string;
  @IsString()
  @MinLength(1)
  language: string;
}
