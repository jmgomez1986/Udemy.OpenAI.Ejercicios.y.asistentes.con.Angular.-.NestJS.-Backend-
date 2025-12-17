import { Injectable, NotFoundException } from '@nestjs/common';
import path from 'path';
import * as fs from 'fs';
import OpenAI from 'openai';
import { GoogleGenAI } from '@google/genai';
import { AudioToTextDto } from './dtos/audioToText.dto';
import {
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';
import {
  audioToTextUseCase,
  orthographyUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';

@Injectable()
export class GptService {
  private openIA = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  private googleGenIA = new GoogleGenAI({});

  async orthographyCheck(orthographyDto: OrthographyDto) {
    return await orthographyUseCase(this.openIA, this.googleGenIA, {
      prompt: orthographyDto.prompt,
    });
  }

  async prosConsDicusser({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserUseCase(this.openIA, { prompt });
  }

  async prosConsDicusserStream({ prompt }: ProsConsDiscusserDto) {
    return await prosConsDicusserStreamUseCase(this.openIA, { prompt });
  }

  async translate(prompt: TranslateDto) {
    return await translateUseCase(this.openIA, prompt);
  }

  async textToAudio(body: TextToAudioDto) {
    return await textToAudioUseCase(this.openIA, body);
  }

  textToAudioGetter(fileId: string) {
    console.log('fileId: ', fileId);
    const filePath = path.resolve(
      __dirname,
      '../../generated/audios',
      `${fileId}.mp3`,
    );

    console.log('filePath: ', filePath);

    const wasFound = fs.existsSync(filePath);

    if (!wasFound)
      throw new NotFoundException(`File with id ${fileId} not found`);

    return filePath;
  }

  async audioToText(
    audioFile: Express.Multer.File,
    audioToTextDto: AudioToTextDto,
  ) {
    return await audioToTextUseCase(this.openIA, {
      audioFile,
      prompt: audioToTextDto.prompt,
    });
  }
}
