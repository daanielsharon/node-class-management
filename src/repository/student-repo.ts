import { ObjectId } from "mongodb";
import { pool } from "../pool.ts";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import {
  DomainStudent,
  DomainStudentClass,
} from "../ts/types/domain/student.js";
import { CurrentCollection } from "../ts/enum/collection.ts";

class StudentRepo {
  static collection: string = CurrentCollection[CurrentCollection.users];

  static async get() {
    try {
      const res = await pool
        .query()
        .collection<DomainStudent>(this.collection)
        .find(
          {
            role: "student",
          },
          {
            projection: {
              _id: 1,
              email: 1,
              name: 1,
            },
          }
        )
        .toArray();
      return res;
    } catch (error) {
      logger.error("get students error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getById(id: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainStudent>(this.collection)
        .findOne(
          {
            _id: new ObjectId(id),
            role: "student",
          },
          {
            projection: {
              _id: 1,
              email: 1,
              name: 1,
            },
          }
        );

      return res;
    } catch (error) {
      logger.error("get student by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getProfile() {
    try {
      const res = await pool
        .query()
        .collection<DomainStudentClass>(this.collection)
        .aggregate([
          {
            $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "student_id",
              as: "classes",
            },
          },
          {
            $project: {
              _id: 1,
              email: 1,
              name: 1,
              "classes._id": 1,
              "classes.name": 1,
              "classes.room": 1,
              "classes.status": 1,
              "classes.schedule": 1,
              "classes.notes": 1,
            },
          },
        ])
        .toArray();

      return res;
    } catch (error) {
      logger.error("get student profile", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getProfileById(id: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainStudentClass>(this.collection)
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: "students",
              localField: "_id",
              foreignField: "student_id",
              as: "classes",
            },
          },
          {
            $project: {
              _id: 1,
              email: 1,
              name: 1,
              "classes._id": 1,
              "classes.name": 1,
              "classes.room": 1,
              "classes.status": 1,
              "classes.schedule": 1,
              "classes.notes": 1,
            },
          },
        ])
        .toArray();

      return res;
    } catch (error) {
      logger.error("get profile by id", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default StudentRepo;
