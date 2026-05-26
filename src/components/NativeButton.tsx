import { Button, Host } from "@expo/ui";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { buttonStyle } from "@expo/ui/swift-ui/modifiers";
import React from "react";
import { Platform, StyleSheet } from "react-native";

type Props = {
	title: string;
	onPress: () => void;
	disabled?: boolean;
};

export const NativeButton: React.FC<Props> = ({ title, onPress, disabled }) => (
	<Host matchContents style={[styles.button, disabled && { opacity: 0.5 }]}>
		<Button
			label={title}
			onPress={onPress}
			disabled={disabled}
			modifiers={Platform.OS === "ios" ? [buttonStyle("borderedProminent")] : [fillMaxWidth()]}
		/>
	</Host>
);

const styles = StyleSheet.create({
	button: {
		width: "100%",
	},
});
