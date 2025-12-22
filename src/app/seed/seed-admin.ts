import env from "../../env";
import { USER_ROLE } from "../modules/user/user.constant";
import type IUser from "../modules/user/user.interface";
import User from "../modules/user/user.model";

export async function seed_admin() {
  const is_super_admin_exist = await User.findOne({
    email: env.SUPER_ADMIN_EMAIL,
  });

  if (is_super_admin_exist) return;

  const payload: Partial<IUser> = {
    name: "Admin",
    role: USER_ROLE.ADMIN,
    email: env.ADMIN_EMAIL,
    password: env.ADMIN_PASSWORD,
    status: "active",
  };

  await User.create(payload);
}
