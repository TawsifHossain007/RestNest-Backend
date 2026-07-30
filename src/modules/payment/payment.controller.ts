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

const getMyPayments = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{
    const userId = req.user?.id
    const result = await paymentService.getMyPayments(userId as string)

     sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Payments Retrieved successfully",
      data: { result },
    });
})

const getMyPaymentsByID = catchAsync(async(req : Request, res : Response, next : NextFunction)=>{
    const paymentId = req.params.id;
    const userId = req.user?.id;

    const result = await paymentService.getMyPaymentsById(userId as string, paymentId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "My Payments Retrieved successfully",
      data: { result },
    });
})


export const paymentController = {
    createCheckOutSession,
    handleWebhook,
    getMyPayments,
    getMyPaymentsByID
}