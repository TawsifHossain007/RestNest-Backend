import { PropertyStatus } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma"
import { IPropertyQuery } from "./property.interface";

const getAllPropertiesFromDB = async (query: IPropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: PropertyWhereInput[] = [];

  // Search across title/description/address/city
  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          address: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Address filter
  if (query.address) {
    andConditions.push({
      address: {
        contains: query.address,
        mode: "insensitive",
      },
    });
  }

  // City filter
  if (query.city) {
    andConditions.push({
      city: {
        contains: query.city,
        mode: "insensitive",
      },
    });
  }

  // Category filter (property "type")
  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
    });
  }

  // Price range filter
  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        ...(query.minPrice && { gte: Number(query.minPrice) }),
        ...(query.maxPrice && { lte: Number(query.maxPrice) }),
      },
    });
  }

  // Bedrooms filter
  if (query.bedrooms) {
    andConditions.push({
      bedrooms: Number(query.bedrooms),
    });
  }

  // Bathrooms filter
  if (query.bathrooms) {
    andConditions.push({
      bathrooms: Number(query.bathrooms),
    });
  }

  // Status filter (AVAILABLE, RENTED, etc.)
  if (query.status) {
    andConditions.push({
      status: query.status as PropertyStatus,
    });
  }

  const result = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      landlord: {
        omit: {
          password: true,
        },
      },
      category: true,
    },
  });

  const totalPropertyCount = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: result,
    meta: {
      page: page,
      limit: limit,
      total: totalPropertyCount,
      totalPages: Math.ceil(totalPropertyCount / limit),
    },
  };
};
const getPropertyById = async(propertyId : string) => {
    const result = await prisma.property.findUnique({
        where : {
            id : propertyId
        }
    })

    return result
}


export const propertyService = {
    getAllPropertiesFromDB,
    getPropertyById,
}