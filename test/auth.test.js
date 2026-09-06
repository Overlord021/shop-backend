// ==================== Auth Tests ====================

import test from "node:test";
import assert from "node:assert";
import { registerStatus, signUp } from "../controllers/auth.js";
import userModel from "../models/user.js";

test("register-status returns enabled: true when 0 users exist", async () => {
  const originalCountDocuments = userModel.countDocuments;
  userModel.countDocuments = async () => 0;

  let statusCode;
  let jsonResponse;
  const req = {};
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  await registerStatus(req, res);

  assert.strictEqual(statusCode, 200);
  assert.deepStrictEqual(jsonResponse, { enabled: true });

  userModel.countDocuments = originalCountDocuments;
});

test("register-status returns enabled: false when 1 user exists", async () => {
  const originalCountDocuments = userModel.countDocuments;
  userModel.countDocuments = async () => 1;

  let statusCode;
  let jsonResponse;
  const req = {};
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  await registerStatus(req, res);

  assert.strictEqual(statusCode, 200);
  assert.deepStrictEqual(jsonResponse, { enabled: false });

  userModel.countDocuments = originalCountDocuments;
});

test("signUp is blocked with 409 Conflict when a user already exists", async () => {
  const originalCountDocuments = userModel.countDocuments;
  userModel.countDocuments = async () => 1;

  let statusCode;
  let jsonResponse;
  const req = {
    body: {
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    },
  };
  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(data) {
      jsonResponse = data;
      return this;
    },
  };

  await signUp(req, res);

  assert.strictEqual(statusCode, 409);
  assert.strictEqual(jsonResponse.success, false);
  assert.ok(jsonResponse.message.includes("غیرفعال است"));

  userModel.countDocuments = originalCountDocuments;
});

test("Simultaneous first-registration attempts result in at most one account creation via unique index constraint", async () => {
  const originalCountDocuments = userModel.countDocuments;
  const originalCreate = userModel.create;

  let users = [];
  userModel.countDocuments = async () => users.length;

  userModel.create = async (doc) => {
    if (users.length >= 1) {
      const err = new Error("Duplicate key error on installed");
      err.code = 11000;
      err.keyPattern = { installed: 1 };
      throw err;
    }
    users.push(doc);
    return { _id: "123", name: doc.name };
  };

  const makeReqRes = () => {
    let statusCode;
    let jsonResponse;
    const req = {
      body: {
        name: "Admin",
        email: "admin@example.com",
        password: "123456",
      },
    };
    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(data) {
        jsonResponse = data;
        return this;
      },
    };
    return { req, res, getResult: () => ({ statusCode, jsonResponse }) };
  };

  const attempt1 = makeReqRes();
  const attempt2 = makeReqRes();

  await Promise.all([
    signUp(attempt1.req, attempt1.res),
    signUp(attempt2.req, attempt2.res),
  ]);

  const res1 = attempt1.getResult();
  const res2 = attempt2.getResult();

  const statuses = [res1.statusCode, res2.statusCode];
  assert.ok(statuses.includes(201));
  assert.ok(statuses.includes(409));
  assert.strictEqual(users.length, 1);

  userModel.countDocuments = originalCountDocuments;
  userModel.create = originalCreate;
});


