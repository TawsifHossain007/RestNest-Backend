import { prisma } from "../../lib/prisma";
import { ICreateRentalRequest } from "./rental.interface";

const createRentalReqInDB = async (
  payload: ICreateRentalRequest,
  tenantId: string,
) => {
  const tenant = await prisma.user.findUniqueOrThrow({
    where: {
      id: tenantId,
    },
  });

  const { message, moveInDate, propertyId } = payload;

  const result = await prisma.rentalRequest.create({
    data: {
      message,
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      tenantId,
      propertyId,
    },
    include : {
        property : {
            select : {
                landlord : {
                    select : {
                        name : true
                    }
                }
            }
        }
    }
  });

  return result;
};

const getMyRentalRequestsFromDB = async(tenantId : string) => {
    const user = await prisma.user.findUnique({
        where : {
            id : tenantId
        }
    })

    const result = await prisma.rentalRequest.findMany({
        where : {
            tenantId : tenantId
        }
    })

    return result;
}

const getMyRentalRequestByIdFromDB = async(tenantId : string, rentalReqId : string) => {
    const user = await prisma.user.findUnique({
        where : {
            id : tenantId
        }
    })

    const result = await prisma.rentalRequest.findUnique({
        where : {
            id : rentalReqId
        }
    })

    if(result?.tenantId !== tenantId){
        throw new Error("You are not authorized to see this request details")
    }

    return result
}

export const rentalService = {
  createRentalReqInDB,
  getMyRentalRequestsFromDB,
  getMyRentalRequestByIdFromDB
};
