import { withAuth } from "next-auth/middleware";

export default withAuth(
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	function middleware(_req) {
		// Add any additional middleware logic here
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	},
);

export const config = {
	matcher: ["/dashboard/:path*", "/meeting/:path*", "/meetings/:path*"],
};
