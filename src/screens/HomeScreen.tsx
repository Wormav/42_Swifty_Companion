import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import apiClient from "../api/api-client";
import { Layout } from "../components/Layout";
import { NativeTextField } from "../components/NativeTextField";
import { HomeScreenNavigationProp } from "../navigation/types";
import { Event42 } from "../types/event";
import { User42 } from "../types/user";

const HomeScreen: React.FC = () => {
	const [login, setLogin] = useState<string>("");
	const [suggestions, setSuggestions] = useState<User42[]>([]);
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation<HomeScreenNavigationProp>();

	const [events, setEvents] = useState<Event42[]>([]);
	const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

	useEffect(() => {
		const fetchInitialData = async (): Promise<void> => {
			try {
				const evts = await apiClient.fetchEvents(31);
				setEvents((prev) => (evts.length > 0 ? evts : prev));
			} catch (e) {
				console.error("Failed to fetch events", e);
			} finally {
				setIsLoadingEvents(false);
			}
		};
		fetchInitialData();
	}, []);

	useEffect(() => {
		const fetchSuggestions = async (): Promise<void> => {
			const text = login.trim().toLowerCase();
			if (text.length < 2) {
				setSuggestions([]);
				setError(null);
				return;
			}

			setIsLoadingList(true);
			setError(null);
			try {
				const data = await apiClient.fetch42<User42[]>(`/users?sort=login&range[login]=${text},${text}z&page[size]=5`);
				setSuggestions(data);
			} catch (err) {
				if (err instanceof Error) {
					if (!err.message.includes("404")) {
						setError(err.message || "Erreur réseau");
					} else {
						setSuggestions([]);
					}
				} else {
					setError("Une erreur inconnue est survenue.");
				}
			} finally {
				setIsLoadingList(false);
			}
		};

		const timeoutId = setTimeout(fetchSuggestions, 500);
		return (): void => clearTimeout(timeoutId);
	}, [login]);

	const handleSelectUser = async (selectedLogin: string): Promise<void> => {
		Keyboard.dismiss();
		setIsLoadingProfile(true);
		setError(null);

		try {
			const userData = await apiClient.fetch42<User42>(`/users/${selectedLogin}`);
			navigation.navigate("Profile", { userData });
		} catch (err) {
			if (err instanceof Error) {
				if (err.message.includes("404")) {
					setError("Utilisateur introuvable.");
				} else {
					setError(err.message || "Une erreur est survenue.");
				}
			} else {
				setError("Une erreur inconnue est survenue.");
			}
		} finally {
			setIsLoadingProfile(false);
		}
	};

	const renderEventCard = (evt: Event42): React.ReactElement => {
		const isExam = evt.kind === "exam";
		const mainColor = isExam ? "#e97e74" : "#00babc";
		const beginDate = new Date(evt.begin_at);
		const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

		const dayName = days[beginDate.getDay()];
		const dateNum = beginDate.getDate();
		const monthName = months[beginDate.getMonth()];

		let durationStr = "";
		if (evt.end_at) {
			const ms = new Date(evt.end_at).getTime() - beginDate.getTime();
			const h = Math.floor(ms / 3600000);
			const m = Math.floor((ms % 3600000) / 60000);
			if (h > 0) durationStr = `${h}h${m > 0 ? m : ""}`;
			else durationStr = `${m}m`;
		}

		// Time until
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

		return (
			<View key={evt.id} style={[styles.eventCard, { borderColor: mainColor }]}>
				<View style={[styles.eventDateBlock, { backgroundColor: mainColor }]}>
					<Text style={styles.eventDayName}>{dayName}</Text>
					<Text style={styles.eventDateNum}>{dateNum}</Text>
					<Text style={styles.eventMonthName}>{monthName}</Text>
				</View>
				<View style={styles.eventContent}>
					<View style={styles.eventHeaderRow}>
						<Text style={[styles.eventKind, { color: mainColor }]}>
							{evt.kind ? evt.kind.charAt(0).toUpperCase() + evt.kind.slice(1) : "Event"}
						</Text>
						<Text style={styles.eventName} numberOfLines={2}>
							{evt.name}
						</Text>
					</View>

					<View style={styles.eventInfoRow}>
						{durationStr ? (
							<View style={styles.eventInfoItem}>
								<Text style={[styles.eventIcon, { color: mainColor }]}>🗓</Text>
								<Text style={[styles.eventInfoText, { color: mainColor }]}>{durationStr}</Text>
							</View>
						) : null}

						<View style={styles.eventInfoItem}>
							<Text style={[styles.eventIcon, { color: mainColor }]}>🕒</Text>
							<Text style={[styles.eventInfoText, { color: mainColor }]}>{timeUntilStr}</Text>
						</View>

						<View style={styles.eventInfoItem}>
							<Text style={[styles.eventIcon, { color: mainColor }]}>📍</Text>
							<Text style={[styles.eventInfoText, { color: mainColor }]}>{evt.location || "Cluster"}</Text>
						</View>

						{!isExam && (
							<View style={styles.eventInfoItem}>
								<Text style={[styles.eventIcon, { color: mainColor }]}>👥</Text>
								<Text style={[styles.eventInfoText, { color: mainColor }]}>
									{evt.nbr_subscribers}
									{evt.max_people ? `/${evt.max_people}` : ""}
								</Text>
							</View>
						)}
					</View>
				</View>
			</View>
		);
	};

	return (
		<Layout style={{ paddingHorizontal: 10 }}>
			<View style={styles.headerContainer}>
				<Text style={styles.title}>Swifty Companion</Text>
			</View>

			<NativeTextField placeholder="Rechercher un profil (ex: jlorette)" value={login} onChangeText={setLogin} />

			{error && <Text style={styles.error}>{error}</Text>}

			{login.length >= 2 ? (
				<ScrollView style={styles.listContainer} keyboardShouldPersistTaps="handled">
					{isLoadingList && <ActivityIndicator size="small" color="#aaa" />}
					{!isLoadingList &&
						suggestions.map((user) => (
							<TouchableOpacity
								key={user.id}
								style={styles.suggestionItem}
								onPress={() => handleSelectUser(user.login)}
								disabled={isLoadingProfile}
							>
								<Image
									source={{ uri: user.image?.link || user.image?.versions?.micro || undefined }}
									style={styles.avatar}
								/>
								<Text style={styles.suggestionText}>{user.login}</Text>
							</TouchableOpacity>
						))}
				</ScrollView>
			) : (
				<View style={styles.eventsContainer}>
					<Text style={styles.sectionTitle}>AGENDA (Angoulême)</Text>
					{isLoadingEvents ? (
						<ActivityIndicator size="large" color="#00babc" style={{ marginTop: 20 }} />
					) : (
						<ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.eventsScroll}>
							{events.length === 0 ? (
								<Text style={styles.noEventsText}>Aucun événement prévu.</Text>
							) : (
								events.map(renderEventCard)
							)}
						</ScrollView>
					)}
				</View>
			)}

			{isLoadingProfile && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
		</Layout>
	);
};

const styles = StyleSheet.create({
	headerContainer: {
		alignItems: "center",
		marginVertical: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
	},
	error: {
		color: "red",
		marginBottom: 10,
		textAlign: "center",
	},
	listContainer: {
		width: "100%",
		marginTop: 10,
		flex: 1,
	},
	suggestionItem: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f9f9f9",
		padding: 10,
		borderRadius: 8,
		marginBottom: 10,
		borderWidth: 1,
		borderColor: "#eee",
	},
	avatar: {
		width: 40,
		height: 40,
		borderRadius: 20,
		marginRight: 15,
		backgroundColor: "#ccc",
	},
	suggestionText: {
		fontSize: 16,
		fontWeight: "500",
	},
	eventsContainer: {
		marginTop: 30,
		flex: 1,
		width: "100%",
	},
	sectionTitle: {
		fontSize: 22,
		fontWeight: "900",
		color: "#000",
		marginBottom: 15,
		letterSpacing: 1,
	},
	eventsScroll: {
		paddingBottom: 40,
	},
	eventCard: {
		flexDirection: "row",
		backgroundColor: "#fff",
		borderRadius: 6,
		borderWidth: 1,
		marginBottom: 15,
		overflow: "hidden",
		minHeight: 100,
	},
	eventDateBlock: {
		width: 80,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 15,
	},
	eventDayName: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
	},
	eventDateNum: {
		color: "#fff",
		fontSize: 28,
		fontWeight: "900",
		marginVertical: 2,
	},
	eventMonthName: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "500",
	},
	eventContent: {
		flex: 1,
		padding: 15,
		justifyContent: "space-between",
	},
	eventHeaderRow: {
		flexDirection: "row",
		alignItems: "flex-start",
		flexWrap: "wrap",
		marginBottom: 15,
	},
	eventKind: {
		fontSize: 20,
		fontWeight: "900",
		marginRight: 10,
	},
	eventName: {
		fontSize: 16,
		color: "#333",
		flex: 1,
		marginTop: 2,
	},
	eventInfoRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
	},
	eventInfoItem: {
		flexDirection: "row",
		alignItems: "center",
		marginRight: 15,
		marginBottom: 5,
	},
	eventIcon: {
		fontSize: 14,
		marginRight: 4,
	},
	eventInfoText: {
		fontSize: 13,
		fontWeight: "600",
	},
	noEventsText: {
		color: "#888",
		fontStyle: "italic",
	},
});

export default HomeScreen;
