import status from "http-status";
import { uploadBufferToCloudinary } from "../../config/cloudinary.config";
import AppError from "../../errors/AppError";
import { generate_pdf, type IInvoiceData } from "../../utils/invoice";
import { send_email } from "../../utils/sendEmail";
import { use_object_id } from "../../utils/useObjectId";
import Cart from "../cart/cart.model";
import Drone from "../drone/drone.model";
import Order from "../order/order.model";
import type IUser from "../user/user.interface";
import { PAYMENT_STATUS } from "./payment.interface";
import Payment from "./payment.model";

const successPayment = async (query: Record<string, string>) => {
  const session = await Drone.startSession();
  session.startTransaction();

  try {
    // Update payment status
    const updated_payment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.PAID },
      { new: true, runValidators: true, session },
    ).populate("user");

    if (!updated_payment)
      throw new AppError(status.NOT_FOUND, "Payment not found");

    const user = updated_payment.user as IUser;

    // Generate invoice
    const invoiceData: IInvoiceData = {
      price: updated_payment.amount,
      transaction_id: updated_payment.transactionId,
      user_name: user.name || "",
      download_link: "",
    };

    const pdf_buffer = await generate_pdf(invoiceData);
    const cloudinary_result = await uploadBufferToCloudinary(
      pdf_buffer,
      "invoice",
    );

    await Payment.findByIdAndUpdate(
      updated_payment._id,
      { invoiceUrl: cloudinary_result.secure_url },
      { runValidators: true, session },
    );

    const order = await Order.findByIdAndUpdate(
      updated_payment.order,
      { status: "PROCESSING" },
      { runValidators: true, session },
    );
    if (!order) throw new AppError(status.NOT_FOUND, "Order not found");

    // delete cart
    await Cart.deleteMany({ user: use_object_id(user._id) });

    for (const drone of order.drones) {
      await Drone.findOneAndUpdate(
        { _id: drone.id },
        {
          $inc: { quantity: -drone.quantity },
        },
        { session },
      );
    }

    invoiceData.download_link = cloudinary_result.secure_url;

    // Send email with invoice
    await send_email({
      to: user.email,
      subject: "Your purchase Invoice",
      template_name: "invoice",
      template_data: invoiceData,
      attachments: [
        {
          filename: "invoice.pdf",
          content: pdf_buffer,
          contentType: "application/pdf",
        },
      ],
    });

    await session.commitTransaction();
    return { success: true, message: "Payment Completed Successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

const failPayment = async (query: Record<string, string>) => {
  const session = await Drone.startSession();
  session.startTransaction();

  try {
    const updated_payment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.FAILED },
      { new: true, runValidators: true, session },
    );
    if (!updated_payment) throw new Error("Payment not found");

    const updated_order = await Order.findByIdAndUpdate(
      updated_payment.order,
      { status: "FAILED" },
      { runValidators: true, session },
    );

    if (!updated_order) throw new Error("Order not found");

    await session.commitTransaction();
    return { success: false, message: "Payment Failed" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

const cancelPayment = async (query: Record<string, string>) => {
  const session = await Drone.startSession();
  session.startTransaction();

  try {
    const updated_payment = await Payment.findOneAndUpdate(
      { transactionId: query.transactionId },
      { status: PAYMENT_STATUS.CANCELLED },
      { new: true, runValidators: true, session },
    );
    if (!updated_payment) throw new Error("Payment not found");

    const updated_order = await Order.findByIdAndUpdate(
      updated_payment.order,
      { status: "CANCELLED" },
      { runValidators: true, session },
    );
    if (!updated_order) throw new Error("Order not found");

    await session.commitTransaction();
    return { success: false, message: "Payment Cancelled" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};

const getInvoiceDownloadUrl = async (paymentId: string) => {
  const payment = await Payment.findById(use_object_id(paymentId)).select(
    "invoiceUrl",
  );
  if (!payment?.invoiceUrl) {
    throw new AppError(404, "Invoice not found");
  }
  return payment.invoiceUrl;
};

export const PaymentServices = {
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
