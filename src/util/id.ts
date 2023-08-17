import { ObjectId } from "mongodb";

class Util {
  static insertId(array: Array<any>) {
    return array.map((item) => ({ id: item._id, ...item }));
  }

  static stripObjectId(array: Array<any>): Array<any> {
    return array.map((item: { [key: string]: any }) => {
      const obj: { [key: string]: any } = {};
      for (const key of Object.keys(item)) {
        if (key != "_id") {
          obj[key] = item[key];
        }
      }
      return obj;
    });
  }

  static transformId(array: Array<any>): Array<any> {
    const firstResult = this.insertId(array);
    const secondResult = this.stripObjectId(firstResult);
    return secondResult;
  }

  static toObjectId(array: Array<string>): Array<ObjectId> {
    const result = array.map((item) => {
      return new ObjectId(item);
    });

    return result;
  }

  static findFakeId(
    inputId: Array<ObjectId>,
    databaseId: Array<ObjectId>
  ): Array<ObjectId> {
    const fakeId: Array<ObjectId> = [];

    inputId.forEach((input) => {
      databaseId.forEach((data) => {
        if (input !== data) {
          if (!fakeId.includes(input)) {
            fakeId.push(input);
          }
        }
      });
    });

    return fakeId;
  }
}

export default Util;
