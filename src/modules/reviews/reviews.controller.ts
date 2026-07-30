import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { reviewService } from "./review.service";

const postReviews = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await reviewService.postReviewsInDB(userId as string, payload)

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review Posted successfully",
      data: { result },
    });
})

export const reviewController = {
    postReviews
}