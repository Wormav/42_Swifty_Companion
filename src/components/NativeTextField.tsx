import { Host, ObservableState, TextInput, useNativeState } from "@expo/ui";
import { fillMaxWidth } from "@expo/ui/jetpack-compose/modifiers";
import { textFieldStyle } from "@expo/ui/swift-ui/modifiers";
import React, { useEffect } from "react";
import { Platform, StyleSheet } from "react-native";

type Props = {
	placeholder?: string;
	value: string;
	onChangeText: (text: string) => void;
};

const updateNativeState = (state: ObservableState<string>, newValue: string): void => {
	state.value = newValue;
};

export const NativeTextField: React.FC<Props> = ({ placeholder, value, onChangeText }) => {
	const textState = useNativeState(value);

	useEffect(() => {
		if (textState.value !== value) {
			updateNativeState(textState, value);
		}
	}, [value, textState]);

	return (
		<Host matchContents style={styles.input}>
			<TextInput
				placeholder={placeholder}
				value={textState}
				onChangeText={(text) => {
					updateNativeState(textState, text);
					onChangeText(text);
				}}
				modifiers={Platform.OS === "ios" ? [textFieldStyle("roundedBorder")] : [fillMaxWidth()]}
			/>
		</Host>
	);
};

const styles = StyleSheet.create({
	input: {
		width: "100%",
	},
});
