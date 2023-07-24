import { Context } from "../types/Context";
import { checkAuth } from "../middleware/checkjAuth";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { User } from "../entities/User";

@Resolver()
export class GreatingResolver {
  @Query((_return) => String)
  @UseMiddleware(checkAuth)
  async hello(@Ctx() { user }: Context): Promise<string> {
    const existingUser = await User.findOne(user.userId);

    return `Hello ${existingUser ? existingUser.username : "World"}`;
  }
}
