import QueryBuilder from "../../builder/QueryBuilder";
import { send_image_to_cloudinary } from "../../utils/sendImageToCloudinary";
import { BrandSearchableFields } from "./brand.constant";
import type IBrand from "./brand.interface";
import Brand from "./brand.model";

async function get_brands_from_db(query: Record<string, unknown>) {
  const categories_query = new QueryBuilder(Brand.find(), query)
    .search(BrandSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const data = await categories_query.modelQuery;
  const meta = await categories_query.countTotal();
  return {
    data,
    meta,
  };
}

async function create_brand_into_db(payload: IBrand, file: any) {
  if (file) {
    const image_name = `${payload.name}-${crypto.randomUUID()}`;
    const path = file?.path;
    // send image to cloudinary
    const { secure_url } = await send_image_to_cloudinary(image_name, path);
    if (typeof secure_url === "string") payload.logo = secure_url;
  }
  return await Brand.create(payload);
}

async function get_brand_by_id_from_db(id: string) {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
}

async function update_brand_into_db(
  id: string,
  payload: Partial<IBrand>,
  file: any,
) {
  if (file) {
    const image_name = `${id}-${crypto.randomUUID()}`;
    const path = file?.path;
    // send image to cloudinary
    const { secure_url } = await send_image_to_cloudinary(image_name, path);
    if (typeof secure_url === "string") payload.logo = secure_url;
  }
  const brand = await Brand.findByIdAndUpdate(id, payload, { new: true });
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
}

async function delete_brand_from_db(id: string) {
  const brand = await Brand.findByIdAndDelete(id);
  if (!brand) {
    throw new Error("Brand not found");
  }
  return brand;
}

export const BrandServices = {
  get_brands_from_db,
  create_brand_into_db,
  get_brand_by_id_from_db,
  update_brand_into_db,
  delete_brand_from_db,
};
