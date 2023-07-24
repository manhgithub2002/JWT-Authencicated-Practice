import { AuthenticationError } from "apollo-server-express";
import { Context } from "../types/Context";
import { MiddlewareFn } from "type-graphql";
import { error } from "console";
import { UserAuthPayload } from "../types/UserAuthPayload";
import { Secret, verify } from "jsonwebtoken";

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  try {
    const authHeader = context.req.header("Authorization");

    const accessToken = authHeader && authHeader.split(" ")[2];

    if (!accessToken) {
      throw new AuthenticationError("Not authenticated to perform GraphQl");
    }

    const decodedUser = verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET as Secret
    ) as UserAuthPayload;

    context.user = decodedUser;
    console.log("ACCESS TOKEN RECEIVED", decodedUser);
    return next();
  } catch (error) {}
  throw new AuthenticationError(
    `Error authenticating user, ${JSON.stringify(error)}`
  );
};
