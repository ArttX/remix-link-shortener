import { Authenticator } from "remix-auth";
import { GitHubStrategy } from "remix-auth-github";
import { sessionStorage } from "~/services/session.server";
import prisma from "~/prisma/client";

// Types
import type { User } from "@prisma/client";

export type SessionUser = Pick<User, "id" | "name" | "email" | "image">;

const BASE_URL = process.env.BASE_URL;

const gitHubStrategy = new GitHubStrategy(
    {
        clientID: process.env.GITHUB_ID!,
        clientSecret: process.env.GITHUB_SECRET!,
        callbackURL: `${BASE_URL}/auth/github/callback`
    },
    async ({ profile }): Promise<SessionUser> => {
        const currentUser = await prisma.user.findUnique({ where: { email: profile.emails[0].value } });
        if (currentUser) return {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            image: currentUser.image
        };

        const newUser = await prisma.user.create({
            data: {
                id: profile.id,
                email: profile.emails[0].value,
                name: profile.displayName,
                image: profile.photos[0].value
            }
        });

        return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            image: newUser.image
        }
    }
);

const authenticator = new Authenticator<SessionUser>(sessionStorage);

authenticator.use(gitHubStrategy);

export { authenticator };