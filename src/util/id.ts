class Util {
  static insertId(array: Array<any>) {
    return array.map((item) => ({ id: item._id, ...item }));
  }

  static stripObjectId(array: Array<any>) {
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

  static transformId(array: Array<any>) {
    const firstResult = this.insertId(array);
    const secondResult = this.stripObjectId(firstResult);
    return secondResult;
  }
}

export default Util;
