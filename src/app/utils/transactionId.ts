import crypto from "node:crypto";

export const getTransactionId = () => {
  return `tran_${crypto.randomUUID()}`;
};
