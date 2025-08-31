import "./sidebar.css";

interface SidebarProps {
	title: string;
	children: React.ReactNode;
}

export default function Sidebar({ title, children }: SidebarProps) {
	return (
		<div className="sidebar">
			<h2 className="title">{title}</h2>
			<div>{children}</div>
		</div>
	);
}
