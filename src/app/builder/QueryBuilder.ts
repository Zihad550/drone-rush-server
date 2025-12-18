import type { Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const search_term = this?.query?.searchTerm;
    if (search_term)
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: { $regex: search_term, $options: "i" },
        })),
      });
    return this;
  }

  filter() {
    const query_obj = { ...this.query };
    const exclude_fields = ["searchTerm", "sort", "limit", "page", "fields"];
    exclude_fields.forEach((el) => {
      delete query_obj[el];
    });
    this.modelQuery = this.modelQuery.find(query_obj);
    return this;
  }

  sort() {
    let sort = "-_id";
    if (this?.query?.sort && typeof this?.query?.sort === "string")
      sort = this.query.sort.split(",").join(" ");
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  paginate() {
    let page = 1;
    let limit = 10;
    let skip = 0;
    if (this.query.limit && typeof this.query.limit === "string")
      limit = Number(this.query.limit);
    if (this.query.page && typeof this.query.page === "string") {
      page = Number(this.query.page);
      skip = (page - 1) * limit;
    }
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  fields() {
    let fields = "-__v";
    if (this?.query?.fields && typeof this?.query?.fields === "string")
      fields = this.query.fields.split(",").join(" ");
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const total_queries = this.modelQuery.getFilter();

    const total = await this.modelQuery.model.countDocuments(total_queries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const total_page = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      total_page,
    };
  }
}

export default QueryBuilder;
