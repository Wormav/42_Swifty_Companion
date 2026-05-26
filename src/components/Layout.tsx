import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";

type Props = {
	children: React.ReactNode;
} & ViewProps;

export const Layout: React.FC<Props> = ({ children, style, ...rest }) => (
	<View style={[styles.container, style]} {...rest}>
		{children}
	</View>
);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		gap: 16,
		backgroundColor: "#fff",
	},
});
