import { Arg, Mutation, Resolver } from "type-graphql";
import { RegisterInput } from "../types/RegisterInput";
import { User } from "../entities/User";
import * as argon2 from "argon2";
import { UserMutationResponse } from "../types/UserMutationResponse";
import { LoginInput } from "../types/LoginInput";
import { createToken } from "../utils/auth";

@Resolver()
export class UserResolver {
  @Mutation((_return) => UserMutationResponse)
  async register(
    @Arg("registerInput")
    registerInput: RegisterInput
  ): Promise<UserMutationResponse> {
    const { username, password } = registerInput;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return {
        code: 400,
        success: false,
        message: "Duplicated username",
      };
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = User.create({
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return {
      code: 200,
      success: true,
      message: "User registration successful",
      user: newUser,
    };
  }

  @Mutation((_return) => UserMutationResponse)
  async loggin(
    @Arg("logginInput")
    { username, password }: LoginInput
  ): Promise<UserMutationResponse> {
    const existingUser = await User.findOne({ username });

    if (!existingUser) {
      return {
        code: 400,
        success: false,
        message: "User not found",
      };
    }

    const isPasswordValid = await argon2.verify(
      existingUser.password as string,
      password
    );

    if (!isPasswordValid) {
      return {
        code: 400,
        success: false,
        message: "Incorrect password",
      };
    }

    return {
      code: 200,
      success: true,
      message: "Loggin successfully",
      user: existingUser,
      accessToken: createToken(existingUser),
    };
  }
}
