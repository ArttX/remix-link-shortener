import stylesheet from "~/tailwind.css";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

// Types
import type { LinksFunction, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => ({
    charset: "utf-8",
    title: "New Remix App",
    viewport: "width=device-width,initial-scale=1"
});

export const links: LinksFunction = () => [{ rel: "stylesheet", href: stylesheet }];

export default function App() {
    return (
        <html lang="en">
            <head>
                <Meta />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}