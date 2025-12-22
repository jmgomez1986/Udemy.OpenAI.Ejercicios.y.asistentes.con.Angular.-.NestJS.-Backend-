import OpenAI from 'openai';
import * as fs from 'fs';
import { downloadBase64ImageAsPng, downloadImageAsPng } from '../helpers';
import * as path from 'path';

interface Options {
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (
  openIA: OpenAI,
  options: Options,
) => {
  const { prompt, originalImage, maskImage } = options;

  if (!originalImage || !maskImage) {
    const response = await openIA.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
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
  }

  console.log('Original Image: ', originalImage);
  // console.log('Mask Image: ', maskImage);

  const pngImagePath = await downloadImageAsPng(originalImage, true);
  const pngMaskPath = await downloadBase64ImageAsPng(maskImage, true);

  console.log('PNG Image Path: ', pngImagePath);
  // console.log('PNG Mask Path: ', pngMaskPath);

  const response = await openIA.images.edit({
    model: 'dall-e-2',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(pngMaskPath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  if (response.data?.[0]?.url) {
    const locaImagelUrl = await downloadImageAsPng(
      response.data?.[0]?.url,
      false,
    );
    const fileName = path.basename(locaImagelUrl);
    const publicUrl = path.join('generated/images/', fileName);

    return {
      imageUrl: publicUrl,
      openAIUrl: response.data?.[0]?.url,
      revised_prompt: response.data?.[0]?.revised_prompt,
    };
  } else {
    throw new Error('Image generation failed');
  }
};
