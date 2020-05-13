import { map } from 'lodash';
import uuid from 'uuid/v4';
import sharp from 'sharp';
import { uploadFile, downloadFile } from '../utils/file';
import { BadRequestError } from '../utils/errors';

const FILE_CONFIG: any = {
  content: {
    PLAYER_AVATAR: 'upload/player/avatar',
    TEAM_LOGO: 'upload/team/logo',
    NATION_FLAG: 'upload/nation/flag',
    TITLE: 'upload/title/image'
  },
  dimension: {
    ORIGINAL: 'original',
    T640: 640,
    T320: 320,
    T160: 160,
  },
};

const resizeAndUploadSingle = async (fileName: any, buffer: any, fileType: any) => {
  if (!FILE_CONFIG.content[fileType.toUpperCase()]) {
    throw new BadRequestError({ field: 'filename', message: `${fileType.toUpperCase()} not found.` });
  }
  // Convert the original image to  png with sharp
  const originalJPEG = await sharp(buffer).rotate().png().toBuffer();
  const path = FILE_CONFIG.content[fileType];

  await uploadFile(originalJPEG, `${path}/large/${fileName}.png`);

  return fileName;
};

const upload = (files: any, fileType: any) => Promise
  .all(map(files, async file => resizeAndUploadSingle(file.teamId, file.buffer, fileType.toUpperCase())));

const uploadLogoFromUrl = async (fileName: any, url: any) => {
  const buffer = await downloadFile(url);
  return resizeAndUploadSingle(fileName, buffer, 'TEAM_LOGO');
};

const uploadTitleFromUrl = async (fileName: any, url: any) => {
  const buffer = await downloadFile(url);
  return resizeAndUploadSingle(fileName, buffer, 'TITLE');
};

const uploadFlagFromUrl = async (fileName: any, url: any) => {
  const buffer = await downloadFile(url);
  return resizeAndUploadSingle(fileName, buffer, 'NATION_FLAG');
};

const uploadPlayerAvatar = async (files: any) => {
  await Promise.all(map(files, async file => {
    file.buffer = await downloadFile(file.image);
  }));
  await upload(files, 'PLAYER_AVATAR');
};

const uploadTeamLogo = async (files: any) => {
  await Promise.all(map(files, async file => {
    file.buffer = await downloadFile(`https://tmssl.akamaized.net//images/wappen/big/${file.teamId}.png?lm=1458585362`);
  }));
  await upload(files, 'TEAM_LOGO');
};

const uploadFromUrl = async (fileName: any, url: any) => {
  try {
    const buffer = await downloadFile(url);
    return resizeAndUploadSingle(fileName, buffer, 'AD_IMAGES');
  } catch (e) {
    console.log(e);
    return null;
  }
};

export default {
  upload,
  uploadLogoFromUrl,
  uploadFlagFromUrl,
  uploadFromUrl,
  uploadPlayerAvatar,
  uploadTeamLogo,
  uploadTitleFromUrl,
  FILE_CONFIG,
};
