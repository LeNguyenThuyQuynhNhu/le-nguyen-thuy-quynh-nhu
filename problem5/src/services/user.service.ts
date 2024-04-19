// src/services/UserService.ts
import User from "../models/User";
import { WhereOptions } from "sequelize";

export class UserService {
  static async getAllUsers(filter: object) {
    filter = Object.fromEntries(
      Object.entries(filter).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    );
    return await User.findAll({ where: filter as WhereOptions });
  }
  static async createUser(
    user_name: string,
    full_name: string,
    email: string,
    phone: string,
    genther: string,
    password: string
  ) {
    return await User.create({
      user_name,
      full_name,
      email,
      phone,
      genther,
      password,
    });
  }

  static async updateUser(
    user_name: string,
    full_name: string,
    genther: string,
    password: string,
    email: string
  ) {
    return await User.update(
      {
        user_name,
        full_name,
        genther,
        password,
      },
      {
        where: {
          email,
        },
        returning: true
      }
    );
  }

  static async deleteUser(email: string) {
    return await User.update(
      {
        is_deleted: true,
      },
      {
        where: {
          email,
        },
      }
    );
  }
  static async getUser(email: string) {
    return await User.findOne({ where: { email, is_deleted: false } });
  }
}
