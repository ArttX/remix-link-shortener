import prisma from "~/prisma/client";
import { redirect } from "@remix-run/node";

// Types
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ params }) => {
    const link = await prisma.links.findUnique({ where: { shortLink: params.link } });
    if (!link)
        throw new Response("Not found", {
            status: 404
        });

    await prisma.links.update({
        where: { id: link.id },
        data: {
            visits: {
                increment: 1
            }
        }
    });
    return redirect(link.fullLink);
};
