import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCheckOutSession = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const {rentalReqId} = req.body;

    const result = await paymentService.createCheckoutSession(userId as string, rentalReqId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "CheckOut Session Created successfully",
      data: { result },
    });
})

const handleWebhook = catchAsync(
    async( req : Request, res : Response, next : NextFunction) => {
        const event = req.body as Buffer;
        const signature = req.headers['stripe-signature']!;

        await paymentService.handleWebhookInDB(event, signature as string)

        sendResponse(res, {
            success : true,
            statusCode : 200,
            message : "Webhook triggered successfully",
            data : null
        })
    }
)


export const paymentController = {
    createCheckOutSession,
    handleWebhook
}