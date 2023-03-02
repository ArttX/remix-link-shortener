import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import prisma from "~/prisma/client";

// Types
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
    title: "Links | Remix Link Shortener"
});

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: "/"
    });
    const links = await prisma.links.findMany();
    return json({ user, links });
};

export const action: ActionFunction = async ({ request }) => {
    await authenticator.isAuthenticated(request, {
        failureRedirect: "/"
    });

    const formData = await request.formData();
    const linkId = formData.get("linkId");
    if (!linkId) return new Response("Link Id not found", { status: 404 });

    try {
        await prisma.links.delete({
            where: { id: linkId.toString() }
        });
        return new Response("Link created", {
            status: 201
        });
    } catch {
        return new Response("Something went wrong", { status: 404 });
    }
};

export default function LinksPage() {
    const { links } = useLoaderData<typeof loader>();

    return (
        <>
            <h1 className="mt-10 text-center text-3xl font-bold">Shortened links</h1>
            <table className="mt-8 w-full border border-solid border-gray-50">
                <thead className="border border-solid border-gray-50 bg-gray-800">
                    <th className="border border-solid border-gray-50 py-2">Short link</th>
                    <th className="border border-solid border-gray-50 py-2">Full link</th>
                    <th className="border border-solid border-gray-50 py-2">Visits</th>
                    <th className="border border-solid border-gray-50 py-2">Actions</th>
                </thead>
                {links.map((link: any) => (
                    <tr key={link.id} className="border border-solid border-gray-50">
                        <td className="border border-solid border-gray-50 py-1 px-2">
                            /{link.shortLink}
                        </td>
                        <td className="border border-solid border-gray-50 py-1 px-2">
                            {link.fullLink}
                        </td>
                        <td className="border border-solid border-gray-50 py-1 px-2">
                            {link.visits}
                        </td>
                        <td className="border border-solid border-gray-50 py-1 px-2 text-center">
                            <Form method="delete" action="/links">
                                <input type="hidden" name="linkId" hidden value={link.id} />
                                <button className="rounded-lg bg-red-600 py-1 px-2 font-bold hover:bg-red-700 active:bg-red-800">
                                    Delete
                                </button>
                            </Form>
                        </td>
                    </tr>
                ))}
            </table>
        </>
    );
}
