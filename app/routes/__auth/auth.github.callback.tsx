import type { LoaderArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const loader = async ({ request }: LoaderArgs) => {
    return await authenticator.authenticate("github", request, {
        successRedirect: "/",
        failureRedirect: "/fail",
        throwOnError: true
    });
};
