import supertest from "supertest";
import { testPool } from "../helper/test-util.ts";
import { app } from "../../app/web.ts";

describe("api/v1/classes/:id/students", () => {
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

    it("should be able to register students to a class", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");
    });

    it("should fail to register students to a class (fake student)", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id - 1],
        });
      expect(result.statusCode).toBe(400);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(0);
    });

    it("should fail to register students to a class (duplicate student)", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id, students.body.data[0]],
        });
      expect(result.statusCode).toBe(400);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(0);
    });
  });

  describe("DELETE /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to delete students from a class", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id],
        });

      expect(deleteResult.statusCode).toBe(200);
      const studentProfileAfterDeletion = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfileAfterDeletion.statusCode).toBe(200);
      expect(studentProfileAfterDeletion.body.data[0].name).toBe("d");
      expect(studentProfileAfterDeletion.body.data[0].classes.length).toBe(0);
    });

    it("should fail to delete students from a class (fake student)", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id - 1],
        });

      expect(deleteResult.statusCode).toBe(400);
      const studentProfileAfterDeletion = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfileAfterDeletion.statusCode).toBe(200);
      expect(studentProfileAfterDeletion.body.data[0].name).toBe("d");
      expect(studentProfileAfterDeletion.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");
    });

    it("should fail to delete students from a class (duplicate student)", async () => {
      const student = await supertest(app).post("/api/v1/users/register").send({
        email: "d@d.com",
        name: "d",
        role: "student",
      });
      expect(student.statusCode).toBe(200);

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
      const students = await supertest(app).get("/api/v1/students/");

      const result = await supertest(app)
        .post(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id],
        });
      expect(result.statusCode).toBe(200);

      const studentProfile = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfile.statusCode).toBe(200);
      expect(studentProfile.body.data[0].name).toBe("d");
      expect(studentProfile.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");

      const deleteResult = await supertest(app)
        .delete(`/api/v1/classes/${classes.body.data[0]._id}/students`)
        .send({
          students: [students.body.data[0]._id, students.body.data[0]._id],
        });

      expect(deleteResult.statusCode).toBe(400);
      const studentProfileAfterDeletion = await supertest(app).get(
        "/api/v1/students/profile"
      );
      expect(studentProfileAfterDeletion.statusCode).toBe(200);
      expect(studentProfileAfterDeletion.body.data[0].name).toBe("d");
      expect(studentProfileAfterDeletion.body.data[0].classes.length).toBe(1);
      expect(studentProfile.body.data[0].classes[0].name).toBe("science");
    });
  });
});
