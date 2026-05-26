import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
	Search: undefined;
	Profile: { login: string };
};

export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Search">;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;
