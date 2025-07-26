import Google from "@auth/core/providers/google";
import { convexAuth } from "@convex-dev/auth/server";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Google({
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, { userId, type, profile }) {
      // This runs after a user is created or updated via OAuth
      console.log(
        `User ${type === "oauth" ? "authenticated" : "updated"} with ID:`,
        userId,
      );
      console.log("Profile data:", profile);
    },
  },
});
