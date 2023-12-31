import { Response } from "express";
import { Code } from "../ts/enum/response.js";

type StatusToString = {
  [key: number]: string;
};

class ResponseJson {
  static statusToString: StatusToString = {
    200: "OK",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
  };

  static 200(res: Response, data: any) {
    return res
      .status(200)
      .json({
        code: 200,
        status: "OK",
        data,
      })
      .end();
  }

  static 500(res: Response, err: { error: string }) {
    return res
      .status(500)
      .json({
        code: 500,
        status: "Internal Server Error",
        data: err,
      })
      .end();
  }

  static unknown(res: Response, code: Code, err: { error: string }) {
    return res
      .status(code)
      .json({
        code,
        status: this.statusToString[code],
        data: err,
      })
      .end();
  }

  static delete(res: Response) {
    return res.status(200).json({
      code: 200,
      status: "OK",
    });
  }
}

export default ResponseJson;
