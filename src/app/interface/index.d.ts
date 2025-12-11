import { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../modules/user/user.interface";

export interface IJwtPayload extends JwtPayload {
	// user: {
	id: string;
	role: TUserRole;
	// };
}
