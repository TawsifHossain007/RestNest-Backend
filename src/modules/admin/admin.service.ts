import { prisma } from "../../lib/prisma";
import { ICategory } from "./admin.interface"

const createCategoryInDB = async(payload : ICategory) => {
    const {name, description} = payload;

    const result = await prisma.category.create({
        data : {
            name,
            description
        }
    })

    return result;
}

export const adminServices = {
    createCategoryInDB
}