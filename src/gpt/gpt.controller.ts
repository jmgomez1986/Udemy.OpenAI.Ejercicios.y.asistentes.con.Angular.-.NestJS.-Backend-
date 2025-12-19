import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { GptService } from './gpt.service';
import {
  AudioToTextDto,
  ImageGenerationDto,
  ImageVariationDto,
  OrthographyDto,
  ProsConsDiscusserDto,
  TextToAudioDto,
  TranslateDto,
} from './dtos';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  orthographyCheck(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.orthographyCheck(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() body: ProsConsDiscusserDto) {
    return this.gptService.prosConsDicusser(body);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(
    @Body() body: ProsConsDiscusserDto,
    @Res() res: Response,
  ) {
    const stream = await this.gptService.prosConsDicusserStream(body);

    res.setHeader('Content-Type', 'application/json');
    res.status(HttpStatus.OK);

    for await (const chunk of stream) {
      const piece = chunk.choices[0].delta.content || '';
      console.log('piece', piece);
      res.write(piece);
    }

    res.end();
  }

  @Post('translate')
  translate(@Body() body: TranslateDto) {
    return this.gptService.translate(body);
  }

  @Post('text-to-audio')
  async textToAudio(@Body() body: TextToAudioDto, @Res() res: Response) {
    const filePath = await this.gptService.textToAudio(body);
    res.header('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(
    @Res() res: Response,
    @Param('fileId') fileId: string,
  ) {
    const filePath = this.gptService.textToAudioGetter(fileId);
    res.header('Content-Type', 'audio/mp3');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file: Express.Multer.File, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const filename = `${new Date().getTime()}.${fileExtension}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb ',
          }),
          new FileTypeValidator({
            fileType: 'audio/*',
            skipMagicNumbersValidation: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    return this.gptService.audioToText(file, audioToTextDto);
  }

  @Post('image-generation')
  async imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return await this.gptService.imageGeneration({ ...imageGenerationDto });
  }

  @Get('image-generation/:fileName')
  async imageGenerationGetter(
    @Res() res: Response,
    @Param('fileName') fileName: string,
  ) {
    const filePath = this.gptService.imageGenerationGetter(fileName);
    // res.header('Content-Type', 'image/png');
    res.status(HttpStatus.OK);
    res.sendFile(filePath);
  }

  @Post('image-variation')
  async imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return await this.gptService.imageVariation({ ...imageVariationDto });
  }
}
