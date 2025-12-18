import crypto from "node:crypto";

export const get_transaction_id = () => {
  return `tran_${crypto.randomUUID()}`;
};
