import { Link, Form } from "@remix-run/react";

// Types
import type { SessionUser } from "~/services/auth.server";

type Props = {
    session: {
        user?: SessionUser;
    };
};

export default function NavBar({ session }: Props) {
    return (
        <nav className="flex h-12 w-full items-center justify-between bg-gray-800">
            <span className="ml-4 flex h-full flex-col justify-center text-xl font-bold">
                <Link to="/">Remix Link</Link>
            </span>
            {session.user ? (
                <>
                    <div className="mr-auto ml-10 flex h-full items-center">
                        <Link to="/links" className="hover:text-blue-600">
                            Links
                        </Link>
                    </div>
                    <div className="flex h-full items-center gap-4">
                        <div className="flex h-full items-center gap-3">
                            <span className="font-bold">{session.user.name}</span>
                            <img
                                src={session.user.image}
                                alt="avatar"
                                className="h-8 w-8 rounded-full"
                            />
                        </div>
                        <Form method="post" action="/auth/logout">
                            <button className="mr-4 h-8 w-20 rounded-lg bg-blue-600 py-0.5 px-2 font-bold hover:bg-blue-700 active:bg-blue-800">
                                Logout
                            </button>
                        </Form>
                    </div>{" "}
                </>
            ) : (
                <Link
                    to="/login"
                    className="mr-4 flex h-8 w-20 items-center justify-center rounded-lg bg-blue-600 py-0.5 px-2 font-bold hover:bg-blue-700 active:bg-blue-800"
                >
                    Login
                </Link>
            )}
        </nav>
    );
}
