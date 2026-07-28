import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser, IRegisterUserPayload } from "./auth.interface";
import config from "../../config";
import { jwtUtils } from "../../utils/jwtUtils";
import { SignOptions } from "jsonwebtoken";

const registerUserInDB = async (payload: IRegisterUserPayload) => {
  const { name, email, password, role, phone, profilePhoto } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcryptSaltRounds),
  );

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
};

const loginUserFromDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email: email,
    },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid credentials");
  }

  const jwtPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtAccessSecret,
    config.jwtAccessExpiration as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwtRefreshSecret,
    config.jwtRefreshExpiration as SignOptions,
  );

  return { accessToken, refreshToken };
};

const getMyProfileFromDB = async(userId : string) => {
    const user = await prisma.user.findUniqueOrThrow({
        where : {
            id : userId
        },
        omit : {
            password : true
        }
    })

    return user
}

export const authServices = {
  registerUserInDB,
  loginUserFromDB,
  getMyProfileFromDB
};
