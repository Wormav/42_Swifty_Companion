import React from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Event42 } from "../types/event";

type EventModalProps = {
	event: Event42 | null;
	onClose: () => void;
};

export const EventModal: React.FC<EventModalProps> = ({ event, onClose }) => {
	if (!event) return null;

	const isExam = event.kind === "exam";
	const headerColor = isExam ? "#e97e74" : "#00babc";
	const ribbonColor = isExam ? "#d9bcbc" : "#c4a5c9";

	const beginDate = new Date(event.begin_at);

	const dateOptions: Intl.DateTimeFormatOptions = {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	};
	const dateStr = beginDate.toLocaleDateString("fr-FR", dateOptions);

	let durationStr = "";
	if (event.end_at) {
		const ms = new Date(event.end_at).getTime() - beginDate.getTime();
		const h = Math.floor(ms / 3600000);
		const m = Math.floor((ms % 3600000) / 60000);
		if (h > 0) durationStr = `${h}h${m > 0 ? m : ""}`;
		else durationStr = `${m}m`;
	}

	// Time until calculation
	const msUntil = beginDate.getTime() - Date.now();
	let timeUntilStr = "";
	if (msUntil < 0) {
		timeUntilStr = "Started";
	} else {
		const hUntil = Math.floor(msUntil / 3600000);
		if (hUntil > 24) {
			const d = Math.floor(hUntil / 24);
			timeUntilStr = `in ${d} day${d > 1 ? "s" : ""}`;
		} else {
			timeUntilStr = `in about ${hUntil} hour${hUntil > 1 ? "s" : ""}`;
		}
	}

	const location = event.location || "Cluster";

	return (
		<Modal visible={!!event} transparent={true} animationType="fade" onRequestClose={onClose}>
			<View style={styles.overlay}>
				<TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onClose} />

				<View style={styles.modalContent}>
					<View style={[styles.header, { backgroundColor: headerColor }]}>
						<Text style={styles.kindText}>{event.kind ? event.kind.toUpperCase() : "EVENT"}</Text>
						<Text style={styles.titleText}>{event.name.toUpperCase()}</Text>
						<Text style={styles.dateText}>{dateStr}</Text>
					</View>

					<View style={[styles.ribbon, { backgroundColor: ribbonColor }]}>
						{durationStr ? (
							<View style={styles.ribbonItem}>
								<Text style={styles.ribbonIcon}>🗓</Text>
								<Text style={styles.ribbonText}>{durationStr}</Text>
							</View>
						) : null}
						<View style={styles.ribbonItem}>
							<Text style={styles.ribbonIcon}>🕒</Text>
							<Text style={styles.ribbonText}>{timeUntilStr}</Text>
						</View>
						<View style={styles.ribbonItem}>
							<Text style={styles.ribbonIcon}>📍</Text>
							<Text style={styles.ribbonText}>{location}</Text>
						</View>
					</View>

					<ScrollView
						style={styles.descriptionContainer}
						contentContainerStyle={styles.descriptionContent}
						bounces={false}
					>
						<Text style={styles.descriptionText}>{event.description || "Aucune description fournie."}</Text>
					</ScrollView>

					<View style={styles.footer}>
						<TouchableOpacity style={styles.closeButton} onPress={onClose}>
							<Text style={styles.closeButtonText}>Close</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	modalContent: {
		width: "100%",
		maxWidth: 500,
		backgroundColor: "#fff",
		borderRadius: 8,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 10,
	},
	header: {
		padding: 20,
		alignItems: "center",
	},
	kindText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "600",
		letterSpacing: 1,
		marginBottom: 10,
	},
	titleText: {
		color: "#fff",
		fontSize: 20,
		fontWeight: "800",
		textAlign: "center",
		marginBottom: 10,
	},
	dateText: {
		color: "#fff",
		fontSize: 14,
	},
	ribbon: {
		flexDirection: "row",
		justifyContent: "center",
		paddingVertical: 10,
		paddingHorizontal: 20,
		flexWrap: "wrap",
	},
	ribbonItem: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 10,
		marginVertical: 2,
	},
	ribbonIcon: {
		color: "#fff",
		fontSize: 14,
		marginRight: 6,
	},
	ribbonText: {
		color: "#fff",
		fontSize: 14,
		fontWeight: "500",
	},
	descriptionContainer: {
		maxHeight: 250,
	},
	descriptionContent: {
		padding: 25,
	},
	descriptionText: {
		fontSize: 16,
		color: "#333",
		lineHeight: 24,
	},
	footer: {
		flexDirection: "row",
		justifyContent: "flex-end",
		padding: 15,
		borderTopWidth: 1,
		borderTopColor: "#eee",
		backgroundColor: "#fafafa",
	},
	closeButton: {
		backgroundColor: "#fff",
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 4,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	closeButtonText: {
		color: "#333",
		fontWeight: "600",
		fontSize: 14,
	},
});
