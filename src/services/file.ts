import { map } from 'lodash';
import uuid from 'uuid/v4';
import sharp from 'sharp';
import { uploadFile, downloadFile } from '../utils/file';
import { BadRequestError } from '../utils/errors';
import { promises as fs } from 'fs';
import path from 'path';

const pathSaveFileProduct = path.join(__dirname, '/../../resources/image_product')

const FILE_CONFIG: any = {
  content: {
    AD_IMAGES: 'upload/product',
    USER_AVATAR: 'upload/user/avatar',
  },
  dimension: {
    ORIGINAL: 'original',
    T640: 640,
    T320: 320,
    T160: 160,
  },
};

const resizeAndUploadSingle = async (buffer: any, fileType: any) => {
  const fileName = uuid();
  if (!FILE_CONFIG.content[fileType.toUpperCase()]) {
    throw new BadRequestError({ field: 'filename', message: `${fileType.toUpperCase()} not found.` });
  }
  // Convert the original image to  png with sharp
  const originalJPEG = await sharp(buffer).rotate().png().toBuffer();
  const path = FILE_CONFIG.content[fileType];

  await uploadFile(originalJPEG, `${path}/large/${fileName}.png`);

  return fileName;
};

// const upload = async (files: any, fileType: any) => await Promise.all(map(files, async file => {
//   console.log('vao day 1: ', files.length);
  
//   return resizeAndUploadSingle(file.buffer, fileType.toUpperCase())
// }));

const upload = async (files: any, fileType: any) => {
  try {
    let listFile: any = []
    await Promise.all(map(files, async file => {
      const fileName = uuid();
      const originalJPEG = await sharp(file.buffer).rotate().png().toBuffer();
      await fs.writeFile(`${pathSaveFileProduct}/${fileName}.png`, originalJPEG)
      listFile.push(fileName)
    }))
    return listFile
  } catch (e) {
    console.log(e);
  }
}

export default {
  upload,
  FILE_CONFIG,
};
