import { Request, Response } from "express";
import sequelize from "sequelize";
declare global {
  namespace NodeJS {
    interface Global {
      ResponseSuccess: (data: any) => ApiResponse;
      ResponseError: (error: any, res: Response) => Response;
    }
  }
}

declare const global: NodeJS.Global & {
  ResponseSuccess: (data: any) => ApiResponse;
  ResponseError: (error: any, res: Response) => Response;
};

interface ApiResponse {
  status: boolean;
  code?: string;
  message: string | string[];
  data?: any;
}

global.ResponseSuccess = function (data: any): ApiResponse {
  return {
    status: true,
    message: "Success",
    data,
  };
};

global.ResponseError = function (
  err: any,
  res: Response
): Response<ApiResponse> {
  if (err instanceof sequelize.ValidationError) {
    const errors = err.errors.map((e: any) => e.message);
    return res.status(400).json({ status: false, code: "Validation error", errors });
  } else if (err instanceof sequelize.UniqueConstraintError) {
    return res
      .status(409)
      .json({ status: false, code: "Unique constraint error", message: err.message });
  } else if (err instanceof sequelize.DatabaseError) {
    return res
      .status(400)
      .json({ status: false, code: "Database error", message: err.message });
  } else {
    // Handle other errors
    console.error(err.stack);
    if (typeof err === 'string') {
      return res.status(500).json({ status: false, code: err, message: err });
    }
    return res.status(500).json({ status: false, code: "Internal server error", message: err.message || "Internal server error" });
  }
};

export {};
