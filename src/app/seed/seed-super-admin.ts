import env from "../../env";
import { USER_ROLE } from "../modules/user/user.constant";
import type IUser from "../modules/user/user.interface";
import User from "../modules/user/user.model";

export async function seed_super_admin() {
  const is_super_admin_exist = await User.findOne({
    email: env.SUPER_ADMIN_EMAIL,
  });

  if (is_super_admin_exist) return;

  const payload: Partial<IUser> = {
    name: "Super admin",
    role: USER_ROLE.SUPER_ADMIN,
    email: env.SUPER_ADMIN_EMAIL,
    password: env.SUPER_ADMIN_PASSWORD,
    status: "active",
  };

  await User.create(payload);
}
