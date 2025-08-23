import React from "react";
import { ImageSourcePropType } from "react-native";
interface AnimatedButtonProps {
    active: boolean;
    label: string;
    color: string;
    onPress: () => void;
    image: ImageSourcePropType;
    activeTintColor: string;
    defaultTintColor: string;
    customIcon?: React.ReactNode;
    buttonStyle?: object;
    textStyle?: object;
    labelStyle?: object;
    disabled?: boolean;
    maxWidth?: number;
}
declare const AnimatedButton: React.FC<AnimatedButtonProps>;
export default AnimatedButton;
