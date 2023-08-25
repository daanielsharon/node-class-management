import { ObjectId } from "mongodb";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import { pool } from "../pool.ts";
import {
  DomainClass,
  DomainClassCreateUpdate,
} from "../ts/types/domain/class/class.js";
import { CurrentCollection } from "../ts/enum/collection.ts";

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
              from: CurrentCollection[CurrentCollection.students],
              localField: "_id",
              foreignField: "classId",
              as: CurrentCollection[CurrentCollection.students],
              pipeline: [
                {
                  $lookup: {
                    from: CurrentCollection[CurrentCollection.users],
                    localField: "studentId",
                    foreignField: "_id",
                    as: "info",
                  },
                },
                // remove id from students collection
                {
                  $project: {
                    _id: 0,
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [{ $arrayElemAt: ["$info", 0] }, "$$ROOT"],
                    },
                  },
                },
                {
                  $project: {
                    info: 0,
                    studentId: 0,
                    classId: 0,
                  },
                },
              ],
            },
          },
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.instructors],
              localField: "_id",
              foreignField: "classId",
              as: CurrentCollection[CurrentCollection.instructors],
              pipeline: [
                {
                  $lookup: {
                    from: CurrentCollection[CurrentCollection.users],
                    localField: "instructorId",
                    foreignField: "_id",
                    as: "info",
                  },
                },
                // remove id from instructors collection
                {
                  $project: {
                    _id: 0,
                  },
                },
                {
                  $replaceRoot: {
                    newRoot: {
                      $mergeObjects: [{ $arrayElemAt: ["$info", 0] }, "$$ROOT"],
                    },
                  },
                },
                {
                  $project: {
                    info: 0,
                    instructorId: 0,
                    classId: 0,
                  },
                },
              ],
            },
          },
          // {
          //   $project: {
          //     _id: 1,
          //     name: 1,
          //     room: 1,
          //     status: 1,
          //     schedule: 1,
          //     notes: 1,
          //     "students.id": 1,
          //     "students.email": 1,
          //     "students.name": 1,
          //     "instructors.id": 1,
          //     "instructors.email": 1,
          //     "instructors.name": 1,
          //   },
          // },
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
            $match: {
              _id: new ObjectId(id),
            },
          },
          {
            $lookup: {
              from: CurrentCollection[CurrentCollection.students],
              localField: "_id",
              foreignField: "class_id",
              as: CurrentCollection[CurrentCollection.students],
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
              _id: 1,
              name: 1,
              room: 1,
              status: 1,
              schedule: 1,
              notes: 1,
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
    notes = null,
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
          created_at: new Date(),
          updated_at: new Date(),
        });

      return res;
    } catch (error) {
      logger.error("create class error", error);
      if (error instanceof Error) {
        throw new ResponseError(500, error.message);
      }
    }
  }

  static async update(
    { name, room, status, schedule, notes }: DomainClassCreateUpdate,
    id: string
  ) {
    try {
      const res = await pool
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
              updated_at: new Date(),
            },
          }
        );

      return res;
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
