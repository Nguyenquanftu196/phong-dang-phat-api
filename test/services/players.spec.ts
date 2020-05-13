import '@babel/polyfill';
import { assert } from 'chai';
import * as DBUtils from '../utils/database';
import { list } from '../../src/services/players';

describe('services/players', () => {
  before(async () => {
    await DBUtils.setup();
    await DBUtils.tearup();
  });

  let token: any = null;
  let user: any = null;

  describe(`List of players`, () => {
    it("Filter by seasonName", async () => {
      const players = await list({
        seasonName: 2018
      }, {});
      assert.equal(players.count, 4);
    });

    it("Filter by seasonName and positions (FW)", async () => {
      const players = await list({
        positions: ['FW'],
        seasonName: 2018,
      }, {});
      assert.equal(players.count, 1);
    });

    it("Filter by seasonName and positions (FW/MC)", async () => {
      const players = await list({
        positions: ['FW', 'MC'],
        seasonName: 2018,
      }, {});
      assert.equal(players.count, 2);
    });

    it("Filter by seasonName and tournamentId", async () => {
      const players = await list({
        seasonName: 2018,
        tournamentId: 85
      }, {});
      assert.equal(players.count, 1);
    });

    it("Filter by seasonName and tournamentId - 0 players", async () => {
      const players = await list({
        seasonName: 2018,
        tournamentId: 850
      }, {});
      assert.equal(players.count, 0);
    });

    it("Filter by seasonName and teamId", async () => {
      const players = await list({
        seasonName: 2018,
        teamId: 1117
      }, {});
      assert.equal(players.count, 1);
    });

    it("Filter by name", async () => {
      const players = await list({
        seasonName: 2018,
        q: 'Cole'
      }, {});
      assert.equal(players.count, 2);
    });
  })
});