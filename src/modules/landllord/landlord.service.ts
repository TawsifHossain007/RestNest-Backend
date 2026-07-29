import { PropertyStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreatePropertyPayload, IUpdatePropertyPayload } from "./landlord.interface"

const createPropertyInDB = async (
  landlordId: string,
  payload: ICreatePropertyPayload
) => {
  const {
    categoryId,
    title,
    description,
    address,
    city,
    price,
    bedrooms,
    bathrooms,
    sizeSqft,
    amenities,
    images,
    status,
  } = payload;

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Invalid categoryId: category does not exist");
  }

  const result = await prisma.property.create({
    data: {
      landlordId,
      categoryId,
      title,
      description,
      address,
      city,
      price,
      bedrooms,
      bathrooms,
      sizeSqft,
      amenities: amenities ?? [],
      images: images ?? [],
      status: status ?? PropertyStatus.AVAILABLE,
    },
    include: {
      category: true,
    },
  });

  return result;
};

const updatePropertyInDB = async(payload : IUpdatePropertyPayload, propertyId : string, landlordId : string) => {

    const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    throw new Error("Property not found");
  }

    if(property.landlordId !== landlordId){
        throw new Error("You are not the owner of this post!");
    }

    const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category : true
    },
  });

  return result;


}

const deletePropertyFromDB = async(propertyId : string, landlordId: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where : {
            id : propertyId
        }
    })

    if (property.landlordId !== landlordId) {
    throw new Error("You are not authorized to update this post");
  }

  await prisma.property.delete({
    where : {
        id : propertyId
    }
  })

  return null;
}

export const landlordServices = {
    createPropertyInDB,
    updatePropertyInDB,
    deletePropertyFromDB
}