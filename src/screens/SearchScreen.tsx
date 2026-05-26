import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Keyboard, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import apiClient from "../api/api-client";
import { Layout } from "../components/Layout";
import { NativeTextField } from "../components/NativeTextField";
import { SearchScreenNavigationProp } from "../navigation/types";
import { User42 } from "../types/user";

const SearchScreen: React.FC = () => {
	const [login, setLogin] = useState<string>("");
	const [suggestions, setSuggestions] = useState<User42[]>([]);
	const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
	const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation<SearchScreenNavigationProp>();

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

	return (
		<Layout>
			<Text style={styles.title}>Rechercher un profil 42</Text>

			<NativeTextField placeholder="ex: jlorette" value={login} onChangeText={setLogin} />

			{error && <Text style={styles.error}>{error}</Text>}

			<View style={styles.listContainer}>
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
			</View>

			{isLoadingProfile && <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />}
		</Layout>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 20,
	},
	error: {
		color: "red",
		marginBottom: 10,
		textAlign: "center",
	},
	listContainer: {
		width: "100%",
		marginTop: 10,
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
});

export default SearchScreen;
