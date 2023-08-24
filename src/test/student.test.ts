import supertest from "supertest";
import { testPool } from "./helper/test-util.ts";
import { app } from "../app/web.ts";

describe("api/v1/students", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  describe("GET /", () => {
    afterEach(async () => {
      await testPool.drop();
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

      const result = await supertest(app).get("/api/v1/students/");
      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBe(1);
      expect(result.body.data[0].name).toBe("c");
    });
  });

  describe("GET /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to get student by id", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "c@c.com",
        name: "c",
        role: "student",
      });

      const student = await supertest(app).get("/api/v1/students/");
      const result = await supertest(app).get(
        `/api/v1/students/${student.body.data[0].id}`
      );
      expect(result.statusCode).toBe(200);
      expect(result.body.data.name).toBe("c");
    });

    it("should fail to get student by id (wrong id)", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "c@c.com",
        name: "c",
        role: "student",
      });

      const student = await supertest(app).get("/api/v1/students/");
      const result = await supertest(app).get(
        `/api/v1/students/${student.body.data[0].id - 1}`
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Internal Server Error");
    });
  });

  describe("GET /profile", () => {
    afterEach(async () => {
      await testPool.drop();
    });
    it("should be able to get students profile", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "c@c.com",
        name: "c",
        role: "student",
      });

      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "c",
        role: "instructor",
      });

      await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      const classes = await supertest(app).get("/api/v1/classes");
      const students = await supertest(app).get("/api/v1/students");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const studentRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/students`)
        .send({
          students: [students.body.data[0].id],
        });

      expect(studentRegistration.statusCode).toBe(200);

      const instructorRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/instructors`)
        .send({
          instructors: [instructors.body.data[0].id],
        });

      expect(instructorRegistration.statusCode).toBe(200);

      const result = await supertest(app).get("/api/v1/students/profile");

      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBe(1);
      expect(result.body.data[0].name).toBe("c");
      expect(result.body.data[0].classes[0].name).toBe("science");
    });
  });

  describe("GET /profile/:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to get student profile by id", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "c@c.com",
        name: "c",
        role: "student",
      });

      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "c",
        role: "instructor",
      });

      await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      const classes = await supertest(app).get("/api/v1/classes");
      const students = await supertest(app).get("/api/v1/students");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const studentRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/students`)
        .send({
          students: [students.body.data[0].id],
        });

      expect(studentRegistration.statusCode).toBe(200);

      const instructorRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/instructors`)
        .send({
          instructors: [instructors.body.data[0].id],
        });

      expect(instructorRegistration.statusCode).toBe(200);

      const profileId = await supertest(app).get("/api/v1/students/profile");
      const result = await supertest(app).get(
        `/api/v1/students/profile/${profileId.body.data[0].id}`
      );

      expect(result.statusCode).toBe(200);
      expect(result.body.data.name).toBe("c");
      expect(result.body.data.classes[0].name).toBe("science");
    });

    it("should fail to get student profile by id", async () => {
      await supertest(app).post("/api/v1/users/register").send({
        email: "c@c.com",
        name: "c",
        role: "student",
      });

      await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "c",
        role: "instructor",
      });

      await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      const classes = await supertest(app).get("/api/v1/classes");
      const students = await supertest(app).get("/api/v1/students");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const studentRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/students`)
        .send({
          students: [students.body.data[0].id],
        });

      expect(studentRegistration.statusCode).toBe(200);

      const instructorRegistration = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0].id}/instructors`)
        .send({
          instructors: [instructors.body.data[0].id],
        });

      expect(instructorRegistration.statusCode).toBe(200);

      const profileId = await supertest(app).get("/api/v1/students/profile");
      const result = await supertest(app).get(
        `/api/v1/students/profile/${profileId.body.data[0].id - 1}`
      );

      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Internal Server Error");
    });
  });
});
