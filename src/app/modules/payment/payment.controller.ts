import type { Request, Response } from "express";
import env from "../../../env";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import { SSLServices } from "./sslCommerz.service";

const successPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await PaymentServices.successPayment(
		query as Record<string, string>,
	);

	if (result.success) {
		res.redirect(
			`${env.FRONTEND_URL}${env.SSL_CONFIG.SUCCESS_FRONTEND_PATH}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
		);
	}
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await PaymentServices.failPayment(
		query as Record<string, string>,
	);

	if (!result.success) {
		res.redirect(
			`${env.FRONTEND_URL}${env.SSL_CONFIG.FAIL_FRONTEND_PATH}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
		);
	}
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
	const query = req.query;
	const result = await PaymentServices.cancelPayment(
		query as Record<string, string>,
	);

	if (!result.success) {
		res.redirect(
			`${env.FRONTEND_URL}${env.SSL_CONFIG.CANCEL_FRONTEND_PATH}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`,
		);
	}
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
	await SSLServices.validatePayment(req.body);
	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment Validated Successfully",
		data: null,
	});
});

const getInvoiceDownloadUrl = catchAsync(
	async (req: Request, res: Response) => {
		const { paymentId } = req.params;
		const result = await PaymentServices.getInvoiceDownloadUrl(paymentId);
		sendResponse(res, {
			statusCode: 200,
			success: true,
			message: "Invoice download URL retrieved successfully",
			data: result,
		});
	},
);

export const PaymentController = {
	successPayment,
	failPayment,
	cancelPayment,
	validatePayment,
	getInvoiceDownloadUrl,
};
