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


export const landlordController = {
    createProperty,
    updateProperty,
    deletePropertyFromDB,
}