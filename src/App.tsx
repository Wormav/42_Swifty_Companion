import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "./navigation/types";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
	<SafeAreaProvider>
		<SafeAreaView style={styles.flex}>
			<StatusBar barStyle="dark-content" />
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Home">
					<Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
					<Stack.Screen
						name="Profile"
						component={ProfileScreen}
						options={({ route }) => ({
							headerShown: true,
							title: route.params.userData.login,
							headerBackTitle: "Search",
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
