import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import _ from "lodash";
import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      let filter: object = req.query;
      const users = await UserService.getAllUsers(filter);
      res.json((global as any).ResponseSuccess(users));
    } catch (error) {
      console.error(error);
      (global as any).ResponseError(error, res);
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const { user_name, full_name, email, phone, genther, password } = req.body;
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await UserService.createUser(
        user_name,
        full_name,
        email,
        phone,
        genther,
        hashPassword
      );
      res.json((global as any).ResponseSuccess(user));
    } catch (error) {
      console.error(error);
      (global as any).ResponseError(error, res);
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { user_name, full_name, genther, password } = req.body;
      const { email, old_password } = req.query;
      if (!email) {
        return (global as any).ResponseError('"email" is required', res);
      }
      if (password && !old_password) {
        return (global as any).ResponseError('"old_password" is required', res);
      }
      const oldUser = await UserService.getUser(email.toString());
      if (!oldUser) {
        return (global as any).ResponseError("User not found or is deleted", res);
      }
      console.log(oldUser)
      if (password && old_password) {
        const comparePassword = await bcrypt.compare(old_password.toString(), _.get(oldUser, 'dataValues.password'));
        if (!comparePassword) {
          return (global as any).ResponseError("Wrong old password", res);
        }
      }
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await UserService.updateUser(
        user_name,
        full_name,
        genther,
        hashPassword,
        email.toString()
      );
      res.json((global as any).ResponseSuccess(_.get(user, '[1]', {})));
    } catch (error) {
      console.error(error);
      (global as any).ResponseError(error, res);
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email) {
        return (global as any).ResponseError('"email" is required', res);
      }
      await UserService.deleteUser(email.toString());
      res.json((global as any).ResponseSuccess());
    } catch (error) {
      console.error(error);
      (global as any).ResponseError(error, res);
    }
  }
  static async getUser(req: Request, res: Response) {
    try {
      const { email } = req.query;
      if (!email) {
        return (global as any).ResponseError('"email" is required', res);
      }
      const user = await UserService.getUser(email.toString());
      if (!user) {
        return (global as any).ResponseError("User not found or is deleted", res);
      }
      res.json((global as any).ResponseSuccess(user));
    } catch (error) {
      console.error(error);
      (global as any).ResponseError(error, res);
    }
  }
}
