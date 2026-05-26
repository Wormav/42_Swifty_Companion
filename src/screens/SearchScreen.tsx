import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { Layout } from "../components/Layout";
import { NativeButton } from "../components/NativeButton";
import { NativeTextField } from "../components/NativeTextField";
import { SearchScreenNavigationProp } from "../navigation/types";

const SearchScreen: React.FC = () => {
	const [login, setLogin] = useState("");
	const navigation = useNavigation<SearchScreenNavigationProp>();

	const handleSearch = () => {
		if (login.trim().length > 0) {
			navigation.navigate("Profile", { login: login.trim() });
		}
	};

	return (
		<Layout>
			<Text style={styles.title}>Rechercher un profil 42</Text>

			<NativeTextField placeholder="ex: jlorette" value={login} onChangeText={setLogin} />

			<NativeButton title="Rechercher" onPress={handleSearch} disabled={login.trim().length === 0} />
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
});

export default SearchScreen;
