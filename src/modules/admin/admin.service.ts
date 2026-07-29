import { Role, UserStatus } from "../../../generated/prisma/enums";
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

const getAllPropertiesFromDB = async() => {
    const result = await prisma.property.findMany()

    return result;
}

const getAllUsersFromDB = async() => {
    const result = await prisma.user.findMany()

    return result
}

const updateUserStatusInDB = async (userId: string, adminId: string, status: UserStatus) => {
    if (!Object.values(UserStatus).includes(status)) {
        throw new Error("Invalid User Status");
    }

    const user = await prisma.user.findUniqueOrThrow({
        where: { id: userId }
    });

    if (user.id === adminId) {
        throw new Error("You cannot change your own status");
    }

    if (user.role === Role.ADMIN) {
        throw new Error("Cannot change status of another admin");
    }

    const result = await prisma.user.update({
        where: { id: userId },
        data: { status }
    });

    return result;
};

export const adminServices = {
    createCategoryInDB,
    getAllPropertiesFromDB,
    getAllUsersFromDB,
    updateUserStatusInDB
}