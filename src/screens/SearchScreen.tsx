import React, { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { NativeButton } from "../components/NativeButton";
import { NativeTextField } from "../components/NativeTextField";

const SearchScreen: React.FC = () => {
	const [login, setLogin] = useState("");

	return (
		<>
			<Text style={styles.title}>Rechercher un profil 42</Text>

			<NativeTextField placeholder="ex: jlorette" value={login} onChangeText={setLogin} />

			<NativeButton title="Rechercher" onPress={() => {}} disabled={login.trim().length === 0} />
		</>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default SearchScreen;
