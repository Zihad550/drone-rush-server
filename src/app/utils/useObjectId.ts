import { Types } from "mongoose";

export const use_object_id = (id: string | Types.ObjectId) => {
  return new Types.ObjectId(id);
};
