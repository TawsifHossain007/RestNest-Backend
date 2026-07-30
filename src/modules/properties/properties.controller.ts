import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./properties.service";
import httpStatus from "http-status";

const getAllProperties = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const query = req.query
    const result = await propertyService.getAllPropertiesFromDB(query)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Retrieved successfully",
      data: { result },
    });
})

const getPropertyById = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const propertyId = req.params.id;
    
    const result = await propertyService.getPropertyById(propertyId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property Retrieved successfully",
      data: { result },
    });
})



export const propertyController = {
    getAllProperties,
    getPropertyById,
}