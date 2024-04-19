import { Sequelize } from "sequelize";
import config from "../config/config.json";
import _ from "lodash";

const env: string = process.env.NODE_ENV || "development";

const db = new Sequelize({
  dialect: "postgres",
  database: _.get(config, `${env}.database`, "problem"),
  username: _.get(config, `${env}.username`, "user"),
  password: _.get(config, `${env}.password`, "user"),
  host: _.get(config, `${env}.host`, "127.0.0.1"),
  port: _.get(config, `${env}.port`, 5432),
  define: {
    timestamps: true,
  },
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
});
export { db };