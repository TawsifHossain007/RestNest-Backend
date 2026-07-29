import { prisma } from "../../lib/prisma"

const getAllPropertiesFromDB = async() => {
    const result = await prisma.property.findMany()

    return result;
}

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