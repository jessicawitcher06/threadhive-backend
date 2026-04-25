import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { describe, beforeAll, afterAll, afterEach, expect, it } from "vitest";

process.env.JWT_SECRET = process.env.JWT_SECRET || "test_jwt_secret_123";

let app;
let mongoServer;
let usingExternalMongo = false;

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  const deletions = Object.values(collections).map((collection) =>
    collection.deleteMany({})
  );
  await Promise.all(deletions);
};

const registerAndLogin = async () => {
  const unique = Date.now() + Math.floor(Math.random() * 10000);
  const email = `user${unique}@example.com`;
  const password = "Passw0rd!23";

  const registerRes = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email,
    password,
  });

  expect(registerRes.status).toBe(201);
  expect(registerRes.body.success).toBe(true);

  const loginRes = await request(app).post("/api/auth/login").send({
    email,
    password,
  });

  expect(loginRes.status).toBe(200);
  expect(loginRes.body.success).toBe(true);
  expect(loginRes.body.data.token).toBeTruthy();

  return {
    token: loginRes.body.data.token,
    userId: String(loginRes.body.data.user.id),
  };
};

describe("Auth and protected routes", () => {
  beforeAll(async () => {
    const externalUri = process.env.TEST_MONGODB_URI || process.env.MONGODB_URI;
    if (externalUri) {
      usingExternalMongo = true;
      await mongoose.connect(externalUri, {
        dbName: "threadhive_test",
      });
    } else {
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri(), {
        dbName: "threadhive-test",
      });
    }

    const appModule = await import("../../src/app.js");
    app = appModule.default;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    if (!usingExternalMongo && mongoServer) {
      await mongoServer.stop();
    }
  });

  it("registers and logs in a user", async () => {
    const { token, userId } = await registerAndLogin();

    expect(token).toBeTruthy();
    expect(userId).toBeTruthy();
  });

  it("blocks creating a thread without token", async () => {
    const res = await request(app).post("/api/threads").send({
      title: "No token",
      content: "No token content",
      subredditId: new mongoose.Types.ObjectId().toString(),
    });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("allows creating subreddit and thread with token", async () => {
    const { token } = await registerAndLogin();

    const subredditRes = await request(app)
      .post("/api/subreddits")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `testsub-${Date.now()}`,
        description: "Subreddit for tests",
      });

    expect(subredditRes.status).toBe(201);
    expect(subredditRes.body.success).toBe(true);

    const subredditId = String(subredditRes.body.data.subreddit._id);

    const threadRes = await request(app)
      .post("/api/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Smoke thread",
        content: "Created with auth",
        subredditId,
      });

    expect(threadRes.status).toBe(201);
    expect(threadRes.body.success).toBe(true);
  });

  it("blocks author spoofing on protected write routes", async () => {
    const { token } = await registerAndLogin();
    const spoofedAuthorId = new mongoose.Types.ObjectId().toString();

    const subredditSpoofRes = await request(app)
      .post("/api/subreddits")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `spoof-${Date.now()}`,
        description: "Spoof attempt",
        author: spoofedAuthorId,
      });

    expect(subredditSpoofRes.status).toBe(403);

    const validSubredditRes = await request(app)
      .post("/api/subreddits")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: `valid-${Date.now()}`,
        description: "Valid subreddit",
      });

    expect(validSubredditRes.status).toBe(201);

    const subredditId = String(validSubredditRes.body.data.subreddit._id);

    const threadSpoofRes = await request(app)
      .post("/api/threads")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Spoofed",
        content: "Spoof author attempt",
        subredditId,
        authorId: spoofedAuthorId,
      });

    expect(threadSpoofRes.status).toBe(403);
  });
});
