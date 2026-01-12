import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import {
  checkCompleteStatusUseCase,
  createMessageUseCase,
  createRunUseCase,
  createThreadUseCase,
  getMessageListUseCase,
} from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class SamAssistantService {
  private openIA = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async createThread() {
    return await createThreadUseCase(this.openIA);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;

    const message = await createMessageUseCase(this.openIA, {
      threadId,
      question,
    });

    const run = await createRunUseCase(this.openIA, { threadId });

    console.log('Message: ', message);
    console.log('Run: ', run);

    await checkCompleteStatusUseCase(this.openIA, {
      runId: run.id,
      threadId: threadId,
    });

    const messages = await getMessageListUseCase(this.openIA, { threadId });

    return messages;
  }
}
