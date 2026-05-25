import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "Swifty Companion",
	slug: "swifty-companion",
	version: "1.0.0",
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "light",
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.wormav.swiftycompanion",
	},
	android: {
		adaptiveIcon: {
			backgroundColor: "#E6F4FE",
			foregroundImage: "./assets/android-icon-foreground.png",
			backgroundImage: "./assets/android-icon-background.png",
			monochromeImage: "./assets/android-icon-monochrome.png",
		},
		package: "com.wormav.swiftycompanion",
	},
	web: {
		favicon: "./assets/favicon.png",
	},
	extra: {
		api42Uid: process.env.EXPO_PUBLIC_API_42_UID,
		api42Secret: process.env.EXPO_PUBLIC_API_42_SECRET,
	},
});
