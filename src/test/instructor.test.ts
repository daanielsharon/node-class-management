import supertest from "supertest";
import { testPool } from "./helper/test-util.ts";
import { app } from "../app/web.ts";

describe("api/v1/students", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterEach(async () => {
    await testPool.drop();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  it("should be able to get students", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    await supertest(app).post("/api/v1/users/register").send({
      email: "c@c.com",
      name: "c",
      role: "student",
    });

    const result = await supertest(app).get("/api/v1/instructors/");
    expect(result.statusCode).toBe(200);
    expect(result.body.data.length).toBe(1);
    expect(result.body.data[0].name).toBe("d");
  });

  it("should be able to get student by id", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    const instructor = await supertest(app).get("/api/v1/instructors/");
    const result = await supertest(app).get(
      `/api/v1/instructors/${instructor.body.data[0].id}`
    );
    expect(result.statusCode).toBe(200);
    expect(result.body.data.name).toBe("d");
  });
});
