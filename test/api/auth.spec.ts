import "@babel/polyfill";
import request from "supertest";
import uuidv4 from 'uuid/v4';
import * as DBUtils from "../utils/database";
import app from "../../src/app";
import { assert } from 'chai'

describe("api/auth", () => {
  before(async () => {
    return DBUtils.setup();
  });

  let token: any = null;
  let adminToken = null;

  it("should create a anonymous jwt", done => {
    request(app)
      .post("/auth/anonymous")
      .set("Accept", "application/json")
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        token = res.body.token;
        assert.equal(res.status, 200)
        assert.exists(token)

        return done();
      });
  });

  it("Login anonymously", done => {
    request(app)
      .get("/auth/jwt")
      .set("Accept", "application/json")
      .set("Authorization", `bearer ${token}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        assert.exists(res.body.iat)

        return done();
      });
  });

  it("Cannot create root user without basic auth", done => {
    request(app)
      .get("/admin/create")
      .set("Accept", "application/json")
      .expect(401, done);
  });

  it("Create root user", done => {
    request(app)
      .get("/admin/create")
      .auth('root', 'root')
      .set("Accept", "application/json")
      .expect(200, done);
  });

  it("Login as admin", done => {
    request(app)
      .post("/auth/login")
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({ username: 'root', password: 'root' })
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        adminToken = res.body.token;

        return done();
      });
  });

  it("should create an user", done => {
    request(app)
      .post("/user")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Accept", "application/json")
      .expect(200)
      .send({
        id: uuidv4(),
        username: 'hai',
        password: 'hai',
        email: 'hai@nelinelo.com',
        teamId: 613
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        const user = res.body;

        assert.equal(user.username, 'hai');
        assert.equal(user.email, 'hai@nelinelo.com')
        assert.equal(res.status, 200);

        return done();
      });
  });

  it("should fail to create an user", done => {
    request(app)
      .post("/user")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(403, done)
  });

  it("should login", done => {
    request(app)
      .post("/auth/login")
      .set("Authorization", `Bearer ${token}`)
      .set("Accept", "application/json")
      .expect(200)
      .send({
        username: 'hai',
        password: 'hai'
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        assert.exists(res.body.token)

        return done();
      });
  })
});
