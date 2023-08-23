import supertest from "supertest";
import { app } from "../app/web.ts";
import { testPool } from "./helper/test-util.ts";

describe("api/v1/classes", () => {
  beforeAll(async () => {
    await testPool.connect();
  });

  afterAll(async () => {
    await testPool.disconnect();
  });

  describe("POST /", () => {
    afterEach(async () => {
      await testPool.drop();
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

    it("should fail to register class (wrong status)", async () => {
      const result = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "sameday",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to register class (wrong schedule)", async () => {
      const result = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "scheduled",
          schedule: new Date().setDate(new Date().getDate() - 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to register class (no name)", async () => {
      const result = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "",
          room: 8,
          status: "scheduled",
          schedule: new Date().setDate(new Date().getDate() - 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to register class (wrong room number (min 1))", async () => {
      const result = await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "",
          room: 0,
          status: "scheduled",
          schedule: new Date().setDate(new Date().getDate() - 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });
  });

  describe("GET /", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to get classes", async () => {
      for (var i = 0; i < 3; i++) {
        await supertest(app)
          .post("/api/v1/classes")
          .send({
            name: `science${i + 2}`,
            room: i + 1,
            status: "scheduled",
            schedule: new Date().setFullYear(new Date().getFullYear() + i + 1),
            notes: null,
          });
      }

      const result = await supertest(app).get("/api/v1/classes");
      expect(result.statusCode).toBe(200);
      expect(result.body.data.length).toBe(3);
    });
  });

  describe("GET /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to get class by id", async () => {
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

      const result = await supertest(app).get(
        `/api/v1/classes/${classes.body.data[0].id}`
      );
      expect(result.statusCode).toBe(200);
      expect(result.body.data.name).toBe("science");
      expect(result.body.data.status).toBe("scheduled");
    });

    it("should fail to get class by id (wrong id)", async () => {
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

      const result = await supertest(app).get(
        `/api/v1/classes/${classes.body.data[0].id - 1}`
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Internal Server Error");
    });
  });

  describe("PUT /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });
    it("should be able to update classes", async () => {
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
      const result = await supertest(app)
        .put(`/api/v1/classes/${classes.body.data[0].id}`)
        .send({
          name: "science",
          room: 9,
          status: "completed",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      expect(result.statusCode).toBe(200);
      expect(result.body.data.status).toBe("completed");
    });

    it("should fail to update classes (wrong status)", async () => {
      await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 8,
          status: "completed",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      const classes = await supertest(app).get("/api/v1/classes");
      const result = await supertest(app)
        .put(`/api/v1/classes/${classes.body.data[0].id}`)
        .send({
          name: "science",
          room: 9,
          status: "sameday",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to update classes (wrong room number (min 1))", async () => {
      await supertest(app)
        .post("/api/v1/classes")
        .send({
          name: "science",
          room: 9,
          status: "scheduled",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      const classes = await supertest(app).get("/api/v1/classes");
      const result = await supertest(app)
        .put(`/api/v1/classes/${classes.body.data[0].id}`)
        .send({
          name: "science",
          room: 0,
          status: "completed",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to update classes (wrong schedule)", async () => {
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
      const result = await supertest(app)
        .put(`/api/v1/classes/${classes.body.data[0].id}`)
        .send({
          name: "science",
          room: 9,
          status: "completed",
          schedule: new Date().setDate(new Date().getDate() - 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });

    it("should fail to update classes (wrong name)", async () => {
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
      const result = await supertest(app)
        .put(`/api/v1/classes/${classes.body.data[0].id}`)
        .send({
          name: "",
          room: 9,
          status: "completed",
          schedule: new Date().setFullYear(new Date().getFullYear() + 1),
          notes: null,
        });

      expect(result.statusCode).toBe(400);
      expect(result.body.status).toBe("Bad Request");
    });
  });

  describe("DELETE /:id", () => {
    afterEach(async () => {
      await testPool.drop();
    });

    it("should be able to delete class", async () => {
      for (var i = 0; i < 3; i++) {
        await supertest(app)
          .post("/api/v1/classes")
          .send({
            name: `science${i + 2}`,
            room: i + 1,
            status: "scheduled",
            schedule: new Date().setFullYear(new Date().getFullYear() + i + 1),
            notes: null,
          });
      }

      const classes = await supertest(app).get("/api/v1/classes");
      expect(classes.body.data.length).toBe(3);
      const result = await supertest(app).delete(
        `/api/v1/classes/${classes.body.data[0].id}`
      );
      expect(result.statusCode).toBe(200);

      const classesAfterDeletion = await supertest(app).get("/api/v1/classes");
      expect(classesAfterDeletion.body.data.length).toBe(2);
    });

    it("should fail to delete class", async () => {
      for (var i = 0; i < 3; i++) {
        await supertest(app)
          .post("/api/v1/classes")
          .send({
            name: `science${i + 2}`,
            room: i + 1,
            status: "scheduled",
            schedule: new Date().setFullYear(new Date().getFullYear() + i + 1),
            notes: null,
          });
      }

      const classes = await supertest(app).get("/api/v1/classes");
      expect(classes.body.data.length).toBe(3);
      const result = await supertest(app).delete(
        `/api/v1/classes/${classes.body.data[0].id - 1}`
      );
      expect(result.statusCode).toBe(500);
      expect(result.body.status).toBe("Internal Server Error");

      const classesAfterDeletion = await supertest(app).get("/api/v1/classes");
      expect(classesAfterDeletion.body.data.length).toBe(3);
    });
  });
});
