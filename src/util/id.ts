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
    return array.map((item) => {
      return new ObjectId(item);
    });
  }

  static toString(array: Array<ObjectId>): Array<string> {
    return array.map((item) => {
      return item.toString();
    });
  }

  static matchId(
    inputId: Array<ObjectId>,
    databaseId: Array<any>
  ): Array<ObjectId> {
    const matchId: string[] = [];

    databaseId
      .filter((data) => {
        return this.toString(inputId).includes(data._id.toString());
      })
      .forEach((element) => matchId.push(element._id.toString()));

    return this.toObjectId(matchId);
  }

  static findFakeId(
    inputId: Array<ObjectId>,
    databaseId: Array<{ _id: ObjectId }>
  ): Array<ObjectId> {
    let fakeId: string[];

    const res = this.toString(this.matchId(inputId, databaseId));
    fakeId = this.toString(inputId).filter((input) => !res.includes(input));

    return this.toObjectId(fakeId);
  }
}

export default Util;
