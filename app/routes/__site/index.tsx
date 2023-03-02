import { json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import prisma from "~/prisma/client";
import { authenticator } from "~/services/auth.server";

// Types
import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
    title: "Home | Remix Link Shortener"
});

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return json({ user });
};

export const action: ActionFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    if (!user) return json({ success: false, message: "Not logged in" });

    const body = await request.formData();
    const fullLink = body.get("full-link")!;
    const shortLink = body.get("short-link")!;

    if (!fullLink || !shortLink) return json({ success: false, message: "Fill all fields" });

    try {
        await prisma.links.create({
            data: {
                fullLink: fullLink.toString(),
                shortLink: shortLink.toString(),
                userId: user.id
            }
        });
    } catch (err) {
        return json({ success: false, message: "Link not created" });
    }

    return json({ success: true, message: "Link created" });
};

export default function IndexPage() {
    const actionData = useActionData<{ success: boolean; message: string }>();

    return (
        <>
            <h1 className="mt-32 mb-8 text-center text-3xl font-bold">Remix Link Shortener</h1>
            <Form
                method="post"
                className="mx-auto flex w-1/2 flex-col items-center justify-center gap-4"
            >
                <input
                    name="full-link"
                    type="text"
                    placeholder="Enter full link"
                    required
                    className="w-full rounded-lg bg-gray-600 py-1 px-2 text-lg"
                />
                <div className="flex w-full items-center rounded-lg bg-gray-600 px-2 text-center text-lg text-gray-300 focus-within:outline focus-within:outline-1 focus-within:outline-offset-2 focus-within:outline-white">
                    <label htmlFor="short-link">{`http://localhost:3000`}/</label>
                    <input
                        id="short-link"
                        name="short-link"
                        type="text"
                        placeholder="Enter short link"
                        required
                        className="w-full rounded-lg bg-gray-600 py-1 px-2 text-lg outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="h-10 w-28 rounded-lg bg-blue-600 font-bold hover:bg-blue-700 active:bg-blue-800"
                >
                    Shorten
                </button>
            </Form>
            <div className="mt-4 text-center">
                {actionData &&
                    (actionData.success ? (
                        <span className="text-green-500">{actionData.message}</span>
                    ) : (
                        <span className="text-red-500">{actionData.message}</span>
                    ))}
            </div>
        </>
    );
}
