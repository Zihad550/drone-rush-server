import { JwtPayload } from "jsonwebtoken";
import { TUserRole } from "../modules/drUser/drUser.interface";

export interface IJwtPayload extends JwtPayload {
	// user: {
	id: string;
	role: TUserRole;
	// };
}
