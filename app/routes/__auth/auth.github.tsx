import type { ActionArgs } from "@remix-run/node";

import { authenticator } from "~/services/auth.server";

export const action = async ({ request }: ActionArgs) => {
    return await authenticator.authenticate("github", request, {
        successRedirect: "/",
        failureRedirect: "/failed"
    });
};
