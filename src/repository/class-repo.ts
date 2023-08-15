import { ObjectId } from "mongodb";
import { logger } from "../app/logger.js";
import { ResponseError } from "../error/response-error.js";
import { pool } from "../pool.js";
import { CurrentCollection } from "../ts/enum/collection.js";
import {
  DomainClass,
  DomainClassCreateUpdate,
} from "../ts/types/domain/class/class.js";

const classDependency = ["students", "instructors"];

class ClassRepo {
  static collection: string = CurrentCollection[CurrentCollection.classes];

  static async get() {
    try {
      const res = await pool
        .query()
        .collection<DomainClass>(this.collection)
        .aggregate([
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.classes],
              localField: "_id",
              foreignField: "class_id",
              as: CurrentCollection[CurrentCollection.classes],
            },
          },
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.instructors],
              localField: "_id",
              foreignField: "class_id",
              as: CurrentCollection[CurrentCollection.instructors],
            },
          },
          {
            $project: {
              "students.id": 1,
              "students.email": 1,
              "students.name": 1,
              "instructors.id": 1,
              "instructors.email": 1,
              "instructors.name": 1,
            },
          },
        ])
        .toArray();
      return res;
    } catch (error) {
      logger.error("get class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async getById(id: string) {
    try {
      const res = await pool
        .query()
        .collection<DomainClass>(this.collection)
        .aggregate([
          {
            match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.classes],
              localField: "_id",
              foreignField: "class_id",
              as: CurrentCollection[CurrentCollection.classes],
            },
          },
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.instructors],
              localField: "_id",
              foreignField: "class_id",
              as: CurrentCollection[CurrentCollection.instructors],
            },
          },
          {
            $project: {
              "students.id": 1,
              "students.email": 1,
              "students.name": 1,
              "instructors.id": 1,
              "instructors.email": 1,
              "instructors.name": 1,
            },
          },
        ])
        .toArray();

      return res;
    } catch (error) {
      logger.error("get class by id error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async save({
    name,
    room,
    status,
    schedule,
    notes,
  }: DomainClassCreateUpdate) {
    try {
      const res = await pool
        .query()
        .collection<DomainClassCreateUpdate>(this.collection)
        .insertOne({
          name,
          room,
          status,
          schedule,
          notes,
        });

      return res;
    } catch (error) {
      logger.error("create class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static update(
    { name, room, status, schedule, notes }: DomainClassCreateUpdate,
    id: string
  ) {
    try {
      pool
        .query()
        .collection(this.collection)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          {
            $set: {
              name,
              room,
              status,
              schedule,
              notes,
            },
          }
        );
    } catch (error) {
      logger.error("update class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async delete(id: string) {
    try {
      await pool
        .query()
        .collection(this.collection)
        .deleteOne({
          _id: new ObjectId(id),
        });
    } catch (error) {
      logger.error("delete class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }
}

export default ClassRepo;
