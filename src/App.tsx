import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "./navigation/types";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
	<SafeAreaProvider>
		<SafeAreaView style={styles.flex}>
			<StatusBar barStyle="dark-content" />
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Search">
					<Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={({ route }) => ({
							headerShown: true,
							title: route.params.userData.login,
							headerBackTitle: "Recherche",
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	</SafeAreaProvider>
);

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
});

export default App;
