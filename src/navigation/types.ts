import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { User42 } from "../types/user";

export type RootStackParamList = {
	Home: undefined;
	Profile: { userData: User42 };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;
