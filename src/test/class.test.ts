import supertest from "supertest";
import { testPool } from "./helper/test-util.ts";
import { app } from "../app/web.ts";
import { date } from "joi";

describe("api/v1/classes", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterEach(async () => {
    await testPool.drop();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  it("should be able to register class", async () => {
    const result = await supertest(app)
      .post("/api/v1/classes")
      .send({
        name: "science",
        room: 8,
        status: "scheduled",
        schedule: new Date().setFullYear(new Date().getFullYear() + 1),
        notes: null,
      });

    expect(result.statusCode).toBe(200);
    expect(result.body.data.name).toBe("science");
  });
});
