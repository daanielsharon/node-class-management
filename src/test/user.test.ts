import supertest from "supertest";
import { testPool } from "./helper/test-util.ts";
import { app } from "../app/web.ts";

describe("api/v1/users", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterEach(async () => {
    await testPool.drop();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  it("should be able to register user", async () => {
    const result = await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "student",
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.data.name).toBe("d");
    expect(result.body.data.email).toBe("d@d.com");
    expect(result.body.data.role).toBe("student");
  });

  it("should be able to login user", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    const result = await supertest(app).post("/api/v1/users/login").send({
      email: "d@d.com",
    });

    expect(result.statusCode).toBe(200);
    expect(result.body.data.email).toBe("d@d.com");
  });

  it("should be able to get users", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "student",
    });

    const result = await supertest(app).get("/api/v1/users/");
    expect(result.statusCode).toBe(200);
    expect(result.body.data.length).toBe(1);
  });

  it("should be able to get user by id", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    const student = await supertest(app).get("/api/v1/users/");
    const result = await supertest(app).get(
      `/api/v1/users/${student.body.data[0].id}`
    );

    expect(result.statusCode).toBe(200);
    expect(result.body.data.name).toBe("d");
  });

  it("should be able to update user", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    const student = await supertest(app).get("/api/v1/users/");
    const result = await supertest(app)
      .patch(`/api/v1/users/${student.body.data[0].id}`)
      .send({
        name: "x",
      });

    expect(result.statusCode).toBe(200);
    expect(result.body.data.name).toBe("x");
  });

  it("should be able to delete user", async () => {
    await supertest(app).post("/api/v1/users/register").send({
      email: "d@d.com",
      name: "d",
      role: "instructor",
    });

    const student = await supertest(app).get("/api/v1/users/");
    await supertest(app).delete(`/api/v1/users/${student.body.data[0].id}`);

    const result = await supertest(app).get("/api/v1/users/");
    expect(result.statusCode).toBe(200);
    expect(result.body.data.length).toBe(0);
  });
});
