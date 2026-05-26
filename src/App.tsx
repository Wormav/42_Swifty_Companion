import { StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import React from "react";
import SearchScreen from "./screens/SearchScreen";

const App: React.FC = () => (
	<SafeAreaView style={styles.safe}>
		<StatusBar barStyle="dark-content" />
		<View style={styles.container}>
			<SearchScreen />
		</View>
	</SafeAreaView>
);

const styles = StyleSheet.create({
	safe: {
		flex: 1,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
	},
});

export default App;
