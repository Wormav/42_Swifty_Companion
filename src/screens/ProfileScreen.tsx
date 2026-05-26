import { RouteProp, useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text } from "react-native";
import { Layout } from "../components/Layout";
import { RootStackParamList } from "../navigation/types";

type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

const ProfileScreen: React.FC = () => {
	const route = useRoute<ProfileScreenRouteProp>();
	const { userData } = route.params;

	return (
		<Layout>
			<Text style={styles.title}>Profil de {userData.login}</Text>
			<Text>Email: {userData.email}</Text>
			<Text>Level: {userData.cursus_users?.[0]?.level}</Text>
		</Layout>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
});

export default ProfileScreen;
