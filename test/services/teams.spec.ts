import '@babel/polyfill';
import request from 'supertest';
import { assert } from 'chai';
import app from '../../src/app';
import * as DBUtils from '../utils/database';
import { list } from '../../src/services/players';

describe('services/teams', () => {
  before(async () => {
    await DBUtils.setup();
    await DBUtils.tearup();
  });

  let token: any = null;
  let user: any = null;

  describe(`List of teams`, () => {
    it("Filter by seasonName", async () => {
      const teams = await list({
        seasonName: 2018
      }, {});

      assert.equal(teams.count, 4);

      const team = teams.rows[0];
      assert.isNumber(team.teamId);
      assert.isString(team.teamName);
    });
  })
});