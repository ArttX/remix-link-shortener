import { Outlet, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";
import { json } from "@remix-run/node";

// Types
import type { LoaderFunction } from "@remix-run/node";

import NavBar from "~/components/Navbar";
import Footer from "~/components/Footer";

export const loader: LoaderFunction = async ({ request }) => {
    const user = await authenticator.isAuthenticated(request);
    return json({ user });
};

export default function SiteLayout() {
    const { user } = useLoaderData<typeof loader>();

    return (
        <>
            <NavBar session={{ user }} />
            <main className="h-full">
                <Outlet />
            </main>
            <Footer />
        </>
    );
}
