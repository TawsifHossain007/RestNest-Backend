import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordServices } from "./landlord.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const id = req.user?.id;

    const result = await landlordServices.createPropertyInDB(id as string,payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property Created successfully",
      data: { result },
    });
})

const updateProperty = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const payload = req.body;
    const landlordId = req.user?.id;
    const propertyId = req.params.id;

    const result = await landlordServices.updatePropertyInDB(payload, propertyId as string, landlordId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property Updated successfully",
      data: { result },
    });
})

const deletePropertyFromDB = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const landlordId = req.user?.id;
    const propertyId = req.params.id;

    const result = await landlordServices.deletePropertyFromDB(propertyId as string, landlordId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Deleted successfully",
      data: { result },
    });
})

const getMyPropertyReq = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const landlordId = req.user?.id;
    const result = await landlordServices.getMyPropertyReqFromDB(landlordId as string)

     sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Requests Retrieved successfully",
      data: { result },
    });
})

const updateRentalReq = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const userId = req.user?.id;
    const rentalId = req.params.id;
    const {status} = req.body;

    const result = await landlordServices.updateRentalReqInDB(rentalId as string, userId as string, status)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Requests Updated successfully",
      data: { result },
    });
})

const getMyPropertyReviews = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const userId = req.user?.id;

    const result = await landlordServices.getMyPropertyReviewsFromDB(userId as string)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Reviews Retrieved successfully",
      data: { result },
    });
})

export const landlordController = {
    createProperty,
    updateProperty,
    deletePropertyFromDB,
    getMyPropertyReq,
    updateRentalReq,
    getMyPropertyReviews
}