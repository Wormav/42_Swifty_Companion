import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../navigation/types";

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

const ProfileScreen: React.FC = () => {
	const route = useRoute<ProfileScreenRouteProp>();
	const { userData: user } = route.params;

	const allCursus = [...user.cursus_users].sort((a, b) => {
		if (a.cursus.name.toLowerCase().includes("42cursus")) return -1;
		if (b.cursus.name.toLowerCase().includes("42cursus")) return 1;
		return 0;
	});

	const cursus = allCursus[0];
	const skills = cursus?.skills.sort((a, b) => b.level - a.level) || [];
	const level = cursus?.level || 0;
	const levelInt = Math.floor(level);
	const levelPercent = Math.round((level - levelInt) * 100);

	return (
		<View style={styles.container}>
			<ScrollView contentContainerStyle={styles.scrollContent}>
				<View style={styles.header}>
					<Image source={{ uri: user.image?.link || user.image?.versions?.large || undefined }} style={styles.avatar} />
					<Text style={styles.login}>{user.login}</Text>
					<Text style={styles.email}>{user.email}</Text>
				</View>

				<View style={styles.levelContainer}>
					<View style={styles.levelHeader}>
						<Text style={styles.levelInt}>LVL {levelInt}</Text>
						<Text style={styles.levelPercent}>{levelPercent}%</Text>
					</View>
					<View style={styles.progressBarBg}>
						<View style={[styles.progressBarFill, { width: `${levelPercent}%` }]} />
					</View>
				</View>

				<View style={styles.statsBar}>
					<View style={styles.statItem}>
						<Text style={styles.statLabel}>Wallet</Text>
						<Text style={styles.statValue}>{user.wallet} ₳</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={styles.statLabel}>Ev.P</Text>
						<Text style={styles.statValue}>{user.correction_point}</Text>
					</View>
					<View style={styles.statDivider} />
					<View style={styles.statItem}>
						<Text style={styles.statLabel}>Location</Text>
						<Text style={styles.statValue}>{user.location || "Unavailable"}</Text>
					</View>
				</View>

				{skills.length > 0 && (
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>SKILLS</Text>
						{skills.map((skill) => (
							<View key={skill.name} style={styles.skillRow}>
								<View style={styles.skillHeader}>
									<Text style={styles.skillName}>{skill.name}</Text>
									<Text style={styles.skillLevel}>{skill.level.toFixed(2)}</Text>
								</View>
								<View style={styles.skillBarBg}>
									<View style={[styles.skillBarFill, { width: `${Math.min((skill.level / 21) * 100, 100)}%` }]} />
								</View>
							</View>
						))}
					</View>
				)}

				{allCursus.map((c) => {
					const cursusProjects = user.projects_users.filter(
						(p) => p.cursus_ids && p.cursus_ids.includes(c.cursus.id) && p.project.name.indexOf("Exam") === -1,
					);

					if (cursusProjects.length === 0) return null;

					let icon = "🎓";
					if (c.cursus.name.toLowerCase().includes("42cursus")) icon = "🎒";
					else if (c.cursus.name.toLowerCase().includes("piscine")) icon = "🏊";

					return (
						<View key={`projects-${c.cursus.id}`} style={styles.section}>
							<Text style={styles.sectionTitle}>
								{c.cursus.name.toUpperCase()} {icon}
							</Text>
							{cursusProjects.map((projectInfo) => {
								const isValidated =
									projectInfo.status === "finished" && projectInfo.final_mark !== null && projectInfo.final_mark >= 50;
								const isFailed = projectInfo.status === "finished" && !isValidated;
								const isInProgress = projectInfo.status === "in_progress";

								return (
									<View key={projectInfo.id} style={styles.projectRow}>
										<Text style={styles.projectName}>{projectInfo.project.name}</Text>
										<View style={styles.projectMarkContainer}>
											{isValidated && <Text style={styles.markValidated}>✅ {projectInfo.final_mark}</Text>}
											{isFailed && <Text style={styles.markFailed}>❌ {projectInfo.final_mark || 0}</Text>}
											{isInProgress && <Text style={styles.markProgress}>⏳ In progress</Text>}
											{!isValidated && !isFailed && !isInProgress && (
												<Text style={styles.markNeutral}>{projectInfo.status}</Text>
											)}
										</View>
									</View>
								);
							})}
						</View>
					);
				})}
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#ffffff",
	},
	scrollContent: {
		paddingBottom: 40,
	},
	header: {
		alignItems: "center",
		paddingTop: 30,
		paddingBottom: 20,
	},
	avatar: {
		width: 140,
		height: 140,
		borderRadius: 70,
		backgroundColor: "#f5f5f5",
	},
	login: {
		color: "#333333",
		fontSize: 28,
		fontWeight: "bold",
		marginTop: 15,
	},
	email: {
		color: "#777777",
		fontSize: 14,
		marginTop: 5,
	},
	levelContainer: {
		paddingHorizontal: 20,
		marginBottom: 20,
	},
	levelHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "flex-end",
		marginBottom: 8,
	},
	levelInt: {
		color: "#333333",
		fontSize: 20,
		fontWeight: "bold",
	},
	levelPercent: {
		color: "#777777",
		fontSize: 14,
		fontWeight: "bold",
		marginLeft: 4,
		marginBottom: 2,
	},
	progressBarBg: {
		height: 10,
		backgroundColor: "#e0e0e0",
		borderRadius: 5,
		overflow: "hidden",
	},
	progressBarFill: {
		height: "100%",
		backgroundColor: "#00babc",
	},
	statsBar: {
		flexDirection: "row",
		backgroundColor: "#f5f5f5",
		marginHorizontal: 20,
		borderRadius: 12,
		paddingVertical: 15,
		marginBottom: 30,
	},
	statItem: {
		flex: 1,
		alignItems: "center",
	},
	statDivider: {
		width: 1,
		backgroundColor: "#e0e0e0",
	},
	statLabel: {
		color: "#777777",
		fontSize: 12,
		marginBottom: 4,
		textTransform: "uppercase",
	},
	statValue: {
		color: "#333333",
		fontSize: 18,
		fontWeight: "bold",
	},
	section: {
		paddingHorizontal: 20,
		marginBottom: 30,
	},
	sectionTitle: {
		color: "#333333",
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 15,
		letterSpacing: 1,
	},
	skillRow: {
		marginBottom: 12,
	},
	skillHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 5,
	},
	skillName: {
		color: "#555555",
		fontSize: 14,
	},
	skillLevel: {
		color: "#00babc",
		fontSize: 14,
		fontWeight: "bold",
	},
	skillBarBg: {
		height: 6,
		backgroundColor: "#e0e0e0",
		borderRadius: 3,
		overflow: "hidden",
	},
	skillBarFill: {
		height: "100%",
		backgroundColor: "#00babc", // Bleu/vert
	},
	projectRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: "#f0f0f0",
	},
	projectName: {
		color: "#333333",
		fontSize: 16,
		flex: 1,
	},
	projectMarkContainer: {
		marginLeft: 10,
	},
	markValidated: {
		color: "#00babc",
		fontWeight: "bold",
		fontSize: 16,
	},
	markFailed: {
		color: "#e94141",
		fontWeight: "bold",
		fontSize: 16,
	},
	markProgress: {
		color: "#777777",
		fontSize: 14,
		fontStyle: "italic",
	},
	markNeutral: {
		color: "#777777",
		fontSize: 14,
	},
});

export default ProfileScreen;
