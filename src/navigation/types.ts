import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User42 } from "../types/user";

export type RootStackParamList = {
	Search: undefined;
	Profile: { userData: User42 };
};

export type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Search">;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;
