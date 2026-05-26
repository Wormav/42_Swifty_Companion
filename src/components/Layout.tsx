import React from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, ViewProps } from "react-native";

type Props = {
	children: React.ReactNode;
} & ViewProps;

export const Layout: React.FC<Props> = ({ children, style, ...rest }) => (
	<KeyboardAvoidingView
		style={[styles.container, style]}
		behavior={Platform.OS === "ios" ? "padding" : undefined}
		{...rest}
	>
		{children}
	</KeyboardAvoidingView>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "flex-start",
		alignItems: "center",
		gap: 16,
		backgroundColor: "#fff",
	},
});
