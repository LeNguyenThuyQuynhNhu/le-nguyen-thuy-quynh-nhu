import express, { Application, Request, Response, NextFunction } from "express";
import { db } from "./src/db.js";
import router from "./src/routes/index.js";
import dotenv from "dotenv";
import './globals';
dotenv.config();

const app: Application = express();
const PORT = 3012;

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

db.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err: Error) => {
    throw Error("Unable to connect to the database:" + err);
  });

app.use("/", router);

app.get("/health", async (_req, res, _next) => {
  const healthcheck: { uptime: number; message: any; timestamp: number } = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error: any) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

app.listen(PORT, () => {
  console.log(`App listening at on port ${PORT}`);
});
