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
      message: "Property Deleted successfully",
      data: { result },
    });
})

export const paymentController = {
    createCheckOutSession
}