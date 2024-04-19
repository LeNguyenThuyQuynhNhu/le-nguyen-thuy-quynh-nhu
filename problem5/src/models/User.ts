import { db } from "../db.js";
import { Model, DataTypes } from "sequelize";
// db.sync()
class User extends Model {
  declare id: number;
  public user_name!: string;
  public full_name!: string;
  public email!: string;
  public phone!: string;
  public gender!: boolean;
  public password!: string;
  public is_deleted!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    full_name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    genther: {
      type: DataTypes.ENUM(
        "Male", //nam
        "Female", //nữ
        "Other" //khác
      ),
      allowNull: false,
      defaultValue: "Other",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "users",
    modelName: "User",
    timestamps: true,
  }
);

export default User;
