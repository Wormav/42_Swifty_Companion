import { Host } from "@expo/ui";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "./navigation/types";
import ProfileScreen from "./screens/ProfileScreen";
import SearchScreen from "./screens/SearchScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => (
	<Host style={styles.flex}>
		<SafeAreaView style={styles.flex}>
			<StatusBar barStyle="dark-content" />
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="Search"
					screenOptions={{
						headerShown: false,
					}}
				>
					<Stack.Screen name="Search" component={SearchScreen} />
					<Stack.Screen name="Profile" component={ProfileScreen} />
				</Stack.Navigator>
			</NavigationContainer>
		</SafeAreaView>
	</Host>
);

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
});

export default App;
