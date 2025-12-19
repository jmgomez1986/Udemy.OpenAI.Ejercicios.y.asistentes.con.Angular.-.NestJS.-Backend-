import { IsString } from 'class-validator';

export class ImageVariationDto {
  @IsString()
  prompt: string;
  @IsString()
  readonly base64Image: string;
}
