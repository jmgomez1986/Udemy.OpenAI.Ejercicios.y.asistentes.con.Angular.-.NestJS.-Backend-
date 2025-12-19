import OpenAI from 'openai';
import { ImageVariationDto } from '../dtos';
import { downloadImageAsPng } from '../helpers';
import * as fs from 'fs';

export const imageVariationUseCase = async (
  openIA: OpenAI,
  options: ImageVariationDto,
) => {
  const { prompt, base64Image } = options;
  console.log({ prompt, base64Image });
  const pngIagePath = await downloadImageAsPng(base64Image, true);
  const response = await openIA.images.createVariation({
    // Default Model 'dall-e-2' for variations
    model: 'dall-e-2',
    image: fs.createReadStream(pngIagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  const responseImage: OpenAI.Images.Image[] | undefined = response.data;
  if (responseImage && responseImage?.length > 0) {
    const firstImage = responseImage[0];
    const filename = await downloadImageAsPng(firstImage.url ?? '', false);
    const url = `${process.env.SERVER_URL}/gpt/image-generation/${filename}`;

    return {
      imageUrl: url,
      openAIUrl: firstImage.url ?? '',
      revised_prompt: firstImage.revised_prompt ?? '',
    };
  } else {
    throw new Error('Image generation failed');
  }
};
