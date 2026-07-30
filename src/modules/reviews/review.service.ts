import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { ICreateReview } from "./reviews.interface"

const postReviewsInDB = async(userId : string, payload : ICreateReview) => {
    const {comment, rating, rentalRequestId} = payload;

      const rentalRequest = await prisma.rentalRequest.findUnique({
    where: { id: rentalRequestId },
    select: { id: true, tenantId: true, propertyId: true, status: true },
  });

  if (!rentalRequest || rentalRequest.tenantId !== userId) {
    throw new Error("Rental request not found or not yours");
  }

  if(rentalRequest.status !== PaymentStatus.COMPLETED){
    throw new Error ("Cannot Post a review Until the Rental Record is Updated")
  }

    const result = await prisma.review.create({
        data : {
            comment,
            rating,
            rentalRequestId,
            tenantId : userId,
            createdAt : new Date(),
            propertyId : rentalRequest.propertyId,
            
        },
        
    })

    return result
}

export const reviewService = {
    postReviewsInDB
}