import env from "../../env";
import { USER_ROLE } from "../modules/user/user.constant";
import type IUser from "../modules/user/user.interface";
import User from "../modules/user/user.model";

export const seedSuperAdmin = async () => {
	try {
		const isSuperAdminExist = await User.findOne({
			email: env.SUPER_ADMIN_EMAIL,
		});

		if (isSuperAdminExist) return;

		const payload: Partial<IUser> = {
			name: "Super admin",
			role: USER_ROLE.SUPER_ADMIN,
			email: env.SUPER_ADMIN_EMAIL,
			password: env.SUPER_ADMIN_PASSWORD,
			status: "active",
			phone: "+1234567890",
			address: "System Admin",
		};

		await User.create(payload);
	} catch (error) {
		console.log(error);
	}
};
