
import { assert } from 'chai';
import FileServices from '../../src/services/file';

describe('services/file', () => {
  it('Download, resize and upload image from URL', async () => {
    const name = await FileServices.uploadLogoFromUrl('BarcelonaFC', 'https://tmssl.akamaized.net//images/wappen/tiny/131.png?lm=1406739548');
    assert.isAtMost(name.length, 36);
  });
});
