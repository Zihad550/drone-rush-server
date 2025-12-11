import QueryBuilder from "../../builder/QueryBuilder";
import type { IJwtPayload } from "../../interface";
import { useObjectId } from "../../utils/useObjectId";
import type IShippingInfo from "./shippingInformation.interface";
import ShippingInformation from "./shippingInformation.model";

const ShippingInfoSearchableFields = [
  "street",
  "country",
  "state",
  "city",
  "zipCode",
];

const getAllShippingInformationFromDb = async (
  query: Record<string, unknown>,
) => {
  const shippingInfoQuery = new QueryBuilder(
    ShippingInformation.find().populate("user"),
    query,
  )
    .search(ShippingInfoSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const data = await shippingInfoQuery.modelQuery;
  const meta = await shippingInfoQuery.countTotal();

  return {
    data,
    meta,
  };
};

const getShippingInformationByUserIdFromDb = async (userId: string) => {
  const result = await ShippingInformation.find({ user: userId });
  return result;
};

const getShippingInformationByIdFromDb = async (
  id: string,
  user: IJwtPayload,
) => {
  const result = await ShippingInformation.findOne({
    _id: id,
    user: useObjectId(user.id),
  });
  return result;
};

const createShippingInformationIntoDb = async (payload: IShippingInfo) => {
  const result = await ShippingInformation.create(payload);
  return result;
};

const updateShippingInformationIntoDB = async (
  id: string,
  payload: Partial<IShippingInfo>,
) => {
  const result = await ShippingInformation.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("user");

  return result;
};

const deleteShippingInformationFromDB = async (
  id: string,
  user: IJwtPayload,
) => {
  const result = await ShippingInformation.findOneAndDelete({
    _id: id,
    user: user.id,
  });
  return result;
};

export const ShippingInformationService = {
  getAllShippingInformationFromDb,
  getShippingInformationByUserIdFromDb,
  createShippingInformationIntoDb,
  updateShippingInformationIntoDB,
  deleteShippingInformationFromDB,
  getShippingInformationByIdFromDb,
};
