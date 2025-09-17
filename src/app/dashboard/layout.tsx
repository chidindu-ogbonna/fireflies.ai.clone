export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <div className="mx-auto container">{children}</div>;
}
