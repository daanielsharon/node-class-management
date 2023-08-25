import supertest from "supertest";
import { testPool } from "../helper/test-util.ts";
import { app } from "../../app/web.ts";

describe("api/v1/classes/:id/instructors", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  describe("POST /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to register instructors to a class", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);
    });

    it("should fail to register instructors to a class (fake instructor)", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id - 1],
        });
      expect(result.statusCode).toBe(400);
    });

    it("should fail to register instructors to a class (duplicate instructor)", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [
            instructors.body.data[0]._id,
            instructors.body.data[0]._id,
          ],
        });
      expect(result.statusCode).toBe(400);
    });
  });

  describe("DELETE /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to delete students from a class", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id],
        });

      expect(deleteResult.statusCode).toBe(200);
    });

    it("should fail to delete students from a class (fake instructor)", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id - 1],
        });

      expect(deleteResult.statusCode).toBe(400);
    });

    it("should fail to delete students from a class (duplicate instructor)", async () => {
      const instructor = await supertest(app)
        .post("/api/v1/users/register")
        .send({
          email: "d@d.com",
          name: "d",
          role: "instructor",
        });
      expect(instructor.statusCode).toBe(200);

      const newClass = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });
      expect(newClass.statusCode).toBe(200);

      const classes = await supertest(app).get("/api/v1/classes");
      const instructors = await supertest(app).get("/api/v1/instructors");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [instructors.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/instructors`)
        .send({
          instructors: [
            instructors.body.data[0]._id,
            instructors.body.data[0]._id,
          ],
        });

      expect(deleteResult.statusCode).toBe(400);
    });
  });
});
