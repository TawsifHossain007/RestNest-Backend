import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { IRegisterUserPayload } from "./auth.interface";
import config from "../../config";

const registerUserInDB = async(payload : IRegisterUserPayload) => {
    const {name, email, password, role, phone, profilePhoto} = payload;

    const isUserExist = await prisma.user.findUnique({
    where: { email }
});

if (isUserExist) {
    throw new Error("User with this email already exists");
}

    const hashedPassword = await bcrypt.hash(password, Number(config.bcryptSaltRounds))

     const result = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            role,
            phone,
            profilePhoto,
            status: "ACTIVE",
        },
        omit: { password: true },
    });

    return result;
}

export const authServices = {
    registerUserInDB
}