import QueryBuilder from "../../builder/QueryBuilder";
import type { IJwtPayload } from "../../interface";
import { use_object_id } from "../../utils/useObjectId";
import type IShippingInfo from "./shippingInformation.interface";
import ShippingInformation from "./shippingInformation.model";

const ShippingInfoSearchableFields = [
  "street",
  "country",
  "state",
  "city",
  "zipCode",
];

async function getAllShippingInformationFromDb(query: Record<string, unknown>) {
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
}

async function getShippingInformationByUserIdFromDb(userId: string) {
  const result = await ShippingInformation.find({ user: userId });
  return result;
}

async function getShippingInformationByIdFromDb(id: string, user: IJwtPayload) {
  const result = await ShippingInformation.findOne({
    _id: id,
    user: use_object_id(user.id),
  });
  return result;
}

async function createShippingInformationIntoDb(payload: IShippingInfo) {
  const result = await ShippingInformation.create(payload);
  return result;
}

async function updateShippingInformationIntoDB(
  id: string,
  payload: Partial<IShippingInfo>,
) {
  const result = await ShippingInformation.findByIdAndUpdate(id, payload, {
    new: true,
  }).populate("user");

  return result;
}

async function deleteShippingInformationFromDB(id: string, user: IJwtPayload) {
  const result = await ShippingInformation.findOneAndDelete({
    _id: id,
    user: user.id,
  });
  return result;
}

export const ShippingInformationService = {
  getAllShippingInformationFromDb,
  getShippingInformationByUserIdFromDb,
  createShippingInformationIntoDb,
  updateShippingInformationIntoDB,
  deleteShippingInformationFromDB,
  getShippingInformationByIdFromDb,
};
