import "@babel/polyfill";
import { assert } from "chai";
import request from "supertest";
import * as DBUtils from '../utils/database';
import app from "../../src/app";

describe("api/tournaments", () => {
  before(async () => {
    await DBUtils.setup();
    await DBUtils.tearup();
  });

  it("All tournaments for a season", done => {
    request(app)
      .get("/tournaments?seasonName=2018")
      .set("Authorization", `bearer ${DBUtils.token}`)
      .set("Accept", "application/json")
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const body = res.body;

        assert.equal(body.count, 3);
        assert.isAtLeast(body.rows.length, 3);
        assert.isNumber(body.rows[0].tournamentId);

        return done();
      });
  });
});
