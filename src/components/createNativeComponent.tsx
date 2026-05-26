import { Host } from "@expo/ui";
import React from "react";
import { Platform, StyleProp, ViewStyle } from "react-native";

// Factory for generating native components that can render either a SwiftUI component on iOS or a Jetpack Compose component on Android.
export function createNativeComponent<
	Props,
	IosProps extends Record<string, unknown> = Record<string, unknown>,
	AndroidProps extends Record<string, unknown> = Record<string, unknown>,
>(
	IosComponent: React.ComponentType<IosProps>,
	AndroidComponent: React.ComponentType<AndroidProps>,
	mapIosProps?: (props: Props) => IosProps,
	mapAndroidProps?: (props: Props) => AndroidProps,
): React.FC<Props & { style?: StyleProp<ViewStyle>; disabled?: boolean }> {
	return function NativeComponent(props: Props & { style?: StyleProp<ViewStyle>; disabled?: boolean }) {
		const containerStyle: StyleProp<ViewStyle> = [
			{ width: "100%", justifyContent: "center" } as ViewStyle,
			props.style,
			props.disabled ? { opacity: 0.5 } : false,
		];

		if (Platform.OS === "ios") {
			const iosProps = (mapIosProps ? mapIosProps(props) : props) as unknown as IosProps;
			return (
				<Host style={containerStyle}>
					<IosComponent {...iosProps} />
				</Host>
			);
		}

		const androidProps = (mapAndroidProps ? mapAndroidProps(props) : props) as unknown as AndroidProps;
		return (
			<Host style={containerStyle}>
				<AndroidComponent {...androidProps} />
			</Host>
		);
	};
}
