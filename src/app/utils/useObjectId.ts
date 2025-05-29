import { Types } from "mongoose";

const useObjectId = (payload: string) => {
  return new Types.ObjectId(payload);
};

export default useObjectId;
