import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/",
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/skills/:path*",
        "/create/:path*",
        "/focus/:path*",
        "/kanban/:path*",
        "/leaderboard/:path*",
        "/clubs/:path*",
        "/settings/:path*",
        "/skill/:path*",
    ],
};
