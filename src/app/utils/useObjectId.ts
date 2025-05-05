import { ObjectId } from "mongodb";

const useObjectId = (payload: string) => {
  return new ObjectId(payload);
};

export default useObjectId;
