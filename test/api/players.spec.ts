import "@babel/polyfill";
import { assert } from "chai";
import request from "supertest";
import * as DBUtils from '../utils/database';
import app from "../../src/app";

describe("api/players", () => {
  before(async () => {
    await DBUtils.setup();
    await DBUtils.tearup();
  });

  it("All players for a season", done => {
    request(app)
      .get("/players?seasonName=2018")
      .set("Authorization", `bearer ${DBUtils.token}`)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const body = res.body;

        assert.equal(body.count, 4);
        assert.isAtLeast(body.rows.length, 4);
        assert.include(body.rows[0].seasonName, '2018');

        return done();
      });
  });

  it("All players for a season and a tournament", done => {
    request(app)
      .get("/players?seasonName=2018&tournamentId=22")
      .set("Authorization", `bearer ${DBUtils.token}`)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const body = res.body;

        assert.equal(body.count, 0);
        assert.isAtLeast(body.rows.length, 0);

        return done();
      });
  });

  it("All players for a season and a tournament and a team", done => {
    request(app)
      .get("/players?seasonName=2018&tournamentId=22&teamId=613")
      .set("Authorization", `bearer ${DBUtils.token}`)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const body = res.body;

        assert.equal(body.count, 0);
        assert.equal(body.rows.length, 0);

        return done();
      });
  });
});
