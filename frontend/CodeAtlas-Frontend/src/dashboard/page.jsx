import React from "react";

const stats = [
	{ label: "Projects", value: "12" },
	{ label: "Repositories", value: "28" },
	{ label: "Contributors", value: "64" },
];

export default function DashboardPage() {
	return (
		<main style={styles.container}>
			<header style={styles.header}>
				<div>
					<p style={styles.eyebrow}>CodeAtlas</p>
					<h1 style={styles.title}>Dashboard</h1>
					<p style={styles.subtitle}>Overview of your projects and activity.</p>
				</div>
				<button type="button" style={styles.button}>
					New project
				</button>
			</header>

			<section style={styles.statsGrid} aria-label="Summary">
				{stats.map((stat) => (
					<article key={stat.label} style={styles.card}>
						<p style={styles.cardLabel}>{stat.label}</p>
						<strong style={styles.value}>{stat.value}</strong>
					</article>
				))}
			</section>

			<section style={styles.contentGrid}>
				<article style={styles.panel}>
					<h2 style={styles.heading}>Recent projects</h2>
					<div style={styles.emptyState}>
						<p style={styles.emptyTitle}>No recent projects</p>
						<p style={styles.emptyText}>Create a project to start exploring your code.</p>
					</div>
				</article>

				<article style={styles.panel}>
					<h2 style={styles.heading}>Recent activity</h2>
					<div style={styles.emptyState}>
						<p style={styles.emptyTitle}>No activity yet</p>
						<p style={styles.emptyText}>Your latest updates will appear here.</p>
					</div>
				</article>
			</section>
		</main>
	);
}

const styles = {
	container: {
		minHeight: "100vh",
		padding: "2rem",
		background: "#f8fafc",
		color: "#0f172a",
		fontFamily: "Arial, sans-serif",
	},
	header: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "flex-start",
		gap: "1rem",
		marginBottom: "2rem",
	},
	eyebrow: { margin: 0, color: "#2563eb", fontWeight: 700 },
	title: { margin: "0.35rem 0", fontSize: "2rem" },
	subtitle: { margin: 0, color: "#64748b" },
	button: {
		border: 0,
		borderRadius: "0.5rem",
		padding: "0.7rem 1rem",
		background: "#2563eb",
		color: "white",
		cursor: "pointer",
		fontWeight: 600,
	},
	statsGrid: {
		display: "grid",
		gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
		gap: "1rem",
		marginBottom: "1rem",
	},
	card: { padding: "1.25rem", background: "white", borderRadius: "0.75rem", boxShadow: "0 1px 3px #00000012" },
	cardLabel: { margin: 0, color: "#64748b", fontSize: "0.9rem" },
	value: { display: "block", marginTop: "0.5rem", fontSize: "1.8rem" },
	contentGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" },
	panel: { minHeight: "220px", padding: "1.25rem", background: "white", borderRadius: "0.75rem", boxShadow: "0 1px 3px #00000012" },
	heading: { margin: 0, fontSize: "1.1rem" },
	emptyState: { display: "grid", placeItems: "center", minHeight: "160px", textAlign: "center" },
	emptyTitle: { margin: 0, fontWeight: 600 },
	emptyText: { margin: "0.5rem 0 0", color: "#64748b" },
};
