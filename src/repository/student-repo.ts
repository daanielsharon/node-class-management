import { ObjectId } from "mongodb";
import { pool } from "../pool.ts";
import { logger } from "../app/logger.ts";
import { ResponseError } from "../error/response-error.ts";
import {
  DomainStudent,
  DomainStudentClass,
  DomainStudentId,
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

  static async validateId(id: ObjectId[]) {
    try {
      const res = await pool
        .query()
        .collection<DomainStudentId>("users")
        .aggregate([
          {
            $match: {
              _id: {
                $in: id,
              },
              role: "student",
            },
          },
          {
            $project: {
              _id: 1,
            },
          },
        ])
        .toArray();

      return res;
    } catch (error) {
      logger.error("match student by id", error);
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
              foreignField: "studentId",
              as: "classes",
              pipeline: [
                {
                  $lookup: {
                    from: CurrentCollection[CurrentCollection.classes],
                    localField: "classId",
                    foreignField: "_id",
                    as: "info",
                    pipeline: [
                      {
                        $lookup: {
                          from: CurrentCollection[
                            CurrentCollection.instructors
                          ],
                          localField: "_id",
                          foreignField: "classId",
                          as: CurrentCollection[CurrentCollection.instructors],
                          pipeline: [
                            {
                              $lookup: {
                                from: CurrentCollection[
                                  CurrentCollection.users
                                ],
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
                                  $mergeObjects: [
                                    { $arrayElemAt: ["$info", 0] },
                                    "$$ROOT",
                                  ],
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
                    ],
                  },
                },
                {
                  $project: {
                    _id: 0,
                    studentId: 0,
                    classId: 0,
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
                  },
                },
              ],
            },
          },

          // {
          //   $project: {
          //     // _id: 1,
          //     // email: 1,
          //     // name: 1,
          //     // "classes._id": 1,
          //     // "classes.name": 1,
          //     // "classes.room": 1,
          //     // "classes.status": 1,
          //     // "classes.schedule": 1,
          //     // "classes.notes": 1,
          //   },
          // },
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
              foreignField: "studentId",
              as: "classes",
              pipeline: [
                {
                  $lookup: {
                    from: "classes",
                    localField: "classId",
                    foreignField: "_id",
                    as: "info",
                  },
                },
                {
                  $project: {
                    _id: 0,
                    studentId: 0,
                    classId: 0,
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
                  },
                },
              ],
            },
          },
          // {
          //   $project: {
          //     _id: 1,
          //     email: 1,
          //     name: 1,
          //     "classes._id": 1,
          //     "classes.name": 1,
          //     "classes.room": 1,
          //     "classes.status": 1,
          //     "classes.schedule": 1,
          //     "classes.notes": 1,
          //   },
          // },
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
