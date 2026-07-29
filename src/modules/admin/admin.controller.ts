import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminServices } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const payload = req.body;
    const result = await adminServices.createCategoryInDB(payload);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category Created successfully",
      data: { result },
    });
})


const getAllProperties = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    
    const result = await adminServices.getAllPropertiesFromDB()

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Properties Retrieved successfully",
      data: { result },
    });
})

const getAllUsers = catchAsync(async(req: Request, res: Response, next: NextFunction) => {

    const result = await adminServices.getAllUsersFromDB()

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users Retrieved successfully",
      data: { result },
    });
})

const updateUserStatus = catchAsync(async(req: Request, res: Response, next: NextFunction)=> {
    const adminId = req.user?.id;
    const userId = req.params.id;
    const { status } = req.body;

    const result = await adminServices.updateUserStatusInDB(userId as string, adminId as string, status)

      sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Users Updated successfully",
      data: { result },
    });
})

export const adminController = {
    createCategory,
    getAllProperties,
    getAllUsers,
    updateUserStatus
}