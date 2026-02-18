import { NextFunction, Request, Response } from "express";

function mongoSanitize(req: Request, res: Response, next: NextFunction) {
  function sanitize(obj: any) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
        console.warn(`Removed unsafe key: ${key}`);
      }
    }
  }
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}

export default mongoSanitize;
