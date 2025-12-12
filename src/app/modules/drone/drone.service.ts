import status from "http-status";
import crypto from "crypto";
import AppError from "../../errors/AppError";
import { useObjectId } from "../../utils/useObjectId";
import Cart from "../cart/cart.model";
import Wishlist from "../wishlist/wishlist.model";
import type IDrone from "./drone.interface";
import Drone from "./drone.model";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";

const getDronesFromDB = async (
  query: Record<string, unknown>,
  userId?: string,
) => {
  // Parse comma-separated strings into arrays
  if (typeof query.category === "string") {
    query.category = query.category.split(",");
  }
  if (typeof query.brand === "string") {
    query.brand = query.brand.split(",");
  }
  // Handle price filtering
  if (query.minPrice || query.maxPrice) {
    const priceFilter: any = {};
    if (query.minPrice) priceFilter.$gte = Number(query.minPrice);
    if (query.maxPrice) priceFilter.$lte = Number(query.maxPrice);
    query.price = priceFilter;
    delete query.minPrice;
    delete query.maxPrice;
  }

  const {
    searchTerm,
    category,
    brand,
    price,
    sort = "-quantity",
    limit = 10,
    page = 1,
    fields,
  } = query;

  const skip = (Number(page) - 1) * Number(limit);

  let pipeline: any[] = [];
  let isAggregate = false;

  if (searchTerm) {
    isAggregate = true;
    pipeline = [
      {
        $lookup: {
          from: "brands",
          localField: "brand",
          foreignField: "_id",
          as: "brand",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "reviews",
          foreignField: "_id",
          as: "reviews",
        },
      },
      {
        $unwind: { path: "$brand", preserveNullAndEmptyArrays: true },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { "brand.name": { $regex: searchTerm, $options: "i" } },
            { "category.name": { $regex: searchTerm, $options: "i" } },
          ],
        },
      },
    ];
  }

  // Apply filters
  const matchFilter: any = {};
  if (category && Array.isArray(category)) {
    matchFilter.category = { $in: category };
  }
  if (brand && Array.isArray(brand)) {
    matchFilter.brand = { $in: brand };
  }
  if (price) {
    matchFilter.price = price;
  }

  if (Object.keys(matchFilter).length > 0) {
    pipeline.push({ $match: matchFilter });
  }

  // Sorting
  const sortObj: any = {};
  const sortFields = (sort as string).split(",");
  sortFields.forEach((field) => {
    if (field.startsWith("-")) {
      sortObj[field.slice(1)] = -1;
    } else {
      sortObj[field] = 1;
    }
  });
  // Ensure stable sorting
  if (!sortObj._id) {
    sortObj._id = -1;
  }
  pipeline.push({ $sort: sortObj });

  // Pagination
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: Number(limit) });

  // Fields
  if (fields) {
    const fieldObj: any = { __v: 0 };
    const fieldList = (fields as string).split(",");
    fieldList.forEach((field) => {
      if (field.startsWith("-")) {
        fieldObj[field.slice(1)] = 0;
      } else {
        fieldObj[field] = 1;
      }
    });
    pipeline.push({ $project: fieldObj });
  }

  let data: any[];
  let total: number;

  if (isAggregate) {
    data = await Drone.aggregate(pipeline);

    // Count total
    const countPipeline = [...pipeline.slice(0, -2)]; // Remove skip and limit
    countPipeline.push({ $count: "total" });
    const countResult = await Drone.aggregate(countPipeline);
    total = countResult[0]?.total || 0;
  } else {
    let mongooseQuery = Drone.find(matchFilter)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    if (fields) {
      const selectFields = (fields as string).split(",").join(" ");
      mongooseQuery = mongooseQuery.select(selectFields);
    }

    mongooseQuery = mongooseQuery
      .populate("brand")
      .populate("category")
      .populate("reviews");
    data = await mongooseQuery;

    total = await Drone.countDocuments(matchFilter);
  }

  const totalPage = Math.ceil(total / Number(limit));

  const meta = {
    total,
    page: Number(page),
    limit: Number(limit),
    totalPage,
  };

  // Add wishlist status if user is authenticated
  if (userId) {
    try {
      const wishlistItems = await Wishlist.find({
        user: useObjectId(userId),
      }).select("drone");
      const wishlistDroneIds = wishlistItems.map((item) =>
        item.drone.toString(),
      );

      data.forEach((drone: any) => {
        drone.isInWishlist = wishlistDroneIds.includes(drone._id.toString());
      });
    } catch (error) {
      // Invalid userId, skip wishlist
      console.warn("Invalid userId for wishlist:", userId);
    }
  }

  return {
    data,
    meta,
  };
};

const getDroneByIdFromDB = async (id: string, userId?: string) => {
  const drone = await Drone.findOne({ _id: id })
    .populate("brand")
    .populate("category")
    .populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name",
      },
    });

  if (!drone) throw new AppError(status.NOT_FOUND, "Drone not found!");

  // Add wishlist status if user is authenticated
  if (userId && drone) {
    try {
      const wishlistItem = await Wishlist.findOne({
        user: useObjectId(userId),
        drone: id,
      });
      const cartItem = await Cart.findOne({
        user: useObjectId(userId),
        drone: id,
      });
      drone.isInWishlist = !!wishlistItem;
      drone.isInCart = !!cartItem;
    } catch (error) {
      // Invalid userId, skip
      console.warn("Invalid userId for drone details:", userId);
    }
  }

  return drone;
};

const createDroneIntoDB = async (payload: IDrone, file: any) => {
  if (file) {
    const imageName = `${payload.name}-${crypto.randomUUID()}`;
    const path = file?.path;
    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    if (typeof secure_url === "string") payload.img = secure_url;
  }
  return await Drone.create(payload);
};

const updateDroneByIdFromDB = async (
  id: string,
  payload: Partial<IDrone>,
  file: any,
) => {
  if (file) {
    const imageName = `${id}-${crypto.randomUUID()}`;
    const path = file?.path;
    // send image to cloudinary
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    if (typeof secure_url === "string") payload.img = secure_url;
  } else {
    // Remove img from payload to avoid overwriting with undefined
    delete payload.img;
  }

  const data = await Drone.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  if (!data) throw new AppError(status.NOT_FOUND, "Drone not found!");
  return data;
};

const deleteDroneByIdFromDB = async (id: string) => {
  const data = await Drone.findOneAndDelete({ _id: id });
  if (!data) throw new AppError(status.NOT_FOUND, "Drone not found!");
  return data;
};

export const DroneServices = {
  getDronesFromDB,
  getDroneByIdFromDB,
  createDroneIntoDB,
  updateDroneByIdFromDB,
  deleteDroneByIdFromDB,
};
