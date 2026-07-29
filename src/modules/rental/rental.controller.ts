import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { rentalService } from "./rental.service";

const createRentalReq = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const userId = req.user?.id;
    const payload = req.body;

    const result = await rentalService.createRentalReqInDB(payload, userId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental Request Submitted successfully",
      data: { result },
    });
})

const getMyRentalRequest = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await rentalService.getMyRentalRequestsFromDB(userId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Request Retrieved successfully",
      data: { result },
    });
})

const getMyRentalRequestById = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const rentalReqId = req.params.id;
    const result = await rentalService.getMyRentalRequestByIdFromDB(userId as string, rentalReqId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Request Retrieved successfully",
      data: { result },
    });
})

export const rentalController = {
    createRentalReq,
    getMyRentalRequest,
    getMyRentalRequestById
}