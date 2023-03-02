import { Form } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { json, redirect } from "@remix-run/node";

// Types
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
    title: "Login | Remix Link Shortener"
});

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    if (user) return redirect("/");
    return json({});
};

export default function Login() {
    return (
        <Form
            method="post"
            action="/auth/github"
            className="mx-auto mt-32 flex h-1/3 w-1/4 flex-col items-center justify-center rounded-lg bg-gray-800"
        >
            <h1 className="mb-10 text-2xl">Login</h1>
            <button className="rounded-lg bg-black px-3 py-2">Sign In with Github</button>
        </Form>
    );
}
