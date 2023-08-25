import supertest from "supertest";
import { testPool } from "./helper/test-util.ts";
import { app } from "../app/web.ts";

describe("api/v1/users", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  describe("POST /register", () => {
    afterEach(async () => {
      await testPool.drop();
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

    it("should fail to register user (wrong email)", async () => {
      const result = await supertest(app).post("/api/v1/users/register").send({
        email: "d",
        name: "d",
        role: "student",
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to register user (wrong name)", async () => {
      const result = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "",
        role: "student",
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to register user (wrong role)", async () => {
      const result = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "king",
      });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });
  });

  describe("POST /login", () => {
    afterEach(async () => {
      await testPool.drop();
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

    it("should fail to login user (wrong credential)", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const result = await supertest(app).post("/api/v1/users/login").send({
        email: "c@d.com",
      });

      expect(result.statusCode).toBe(404);
      expect(result.body.status).toBe("Not Found");
    });
  });

  describe("GET /", () => {
    afterEach(async () => {
      await testPool.drop();
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
  });

  describe("GET /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to get user by id", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const student = await supertest(app).get("/api/v1/users/");
      const result = await supertest(app).get(
        `/api/v1/users/${student.body.data[0]._id}`
      );

      expect(result.statusCode).toBe(200);
      expect(result.body.data.name).toBe("d");
    });

    it("should fail to get user by id", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const student = await supertest(app).get("/api/v1/users/");
      const result = await supertest(app).get(
        `/api/v1/users/${student.body.data[0]._id - 1}`
      );

      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Internal Server Error");
    });
  });

  describe("PATCH /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to update user", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const student = await supertest(app).get("/api/v1/users/");
      const result = await supertest(app)
        .patch(`/api/v1/users/${student.body.data[0]._id}`)
        .send({
          name: "x",
        });

      expect(result.statusCode).toBe(200);
      expect(result.body.data.name).toBe("x");
    });

    it("should fail to update user (wrong name (empty)", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const student = await supertest(app).get("/api/v1/users/");
      const result = await supertest(app)
        .patch(`/api/v1/users/${student.body.data[0]._id}`)
        .send({
          name: "",
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });
  });

  describe("DELETE /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to delete user", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const student = await supertest(app).get("/api/v1/users/");
      await supertest(app).delete(`/api/v1/users/${student.body.data[0]._id}`);

      const result = await supertest(app).get("/api/v1/users/");
      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBe(0);
    });

    it("should fail to delete user (wrong id)", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "instructor",
      });

      const resultBeforeDeletion = await supertest(app).get("/api/v1/users/");
      expect(resultBeforeDeletion.statusCode).toBe(200);
      expect(resultBeforeDeletion.body.data.length).toBe(1);

      const deletion = await supertest(app).delete(
        `/api/v1/users/${resultBeforeDeletion.body.data[0]._id - 1}`
      );
      expect(deletion.statusCode).toBe(500);
      expect(deletion.body.status).toBe("Internal Server Error");

      const resultAfterDeletion = await supertest(app).get("/api/v1/users/");
      expect(resultAfterDeletion.statusCode).toBe(200);
      expect(resultAfterDeletion.body.data.length).toBe(1);
    });
  });
});
