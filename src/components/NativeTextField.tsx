import React from "react";
import { Platform, StyleSheet, TextInput } from "react-native";

type Props = {
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
};

export const NativeTextField: React.FC<Props> = ({ placeholder, value, onChangeText }) => (
	<TextInput
		placeholder={placeholder}
		value={value}
		onChangeText={onChangeText}
		style={styles.input}
		placeholderTextColor="#999"
		autoCapitalize="none"
		autoCorrect={false}
	/>
);

const styles = StyleSheet.create({
	input: {
		width: "100%",
		height: 44,
		backgroundColor: "#f5f5f5",
		borderRadius: 10,
		paddingHorizontal: 15,
		fontSize: 16,
		borderWidth: Platform.OS === "android" ? 0 : 1,
		borderColor: "#e0e0e0",
	},
});
