import React, { useEffect, useState } from "react";
import { ImageSourcePropType, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

const INNER_BOX_PADDING_LEFT = 16;
const IMAGE_SIZE = 18;
const TEXT_PADDING = 6;
const TEXT_TRANSLATE_X = 12;

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  active,
  onPress,
  label,
  image,
  color,
  activeTintColor,
  defaultTintColor,
  customIcon,
  buttonStyle,
  textStyle,
  labelStyle,
  disabled = false,
  maxWidth = 144,
}) => {
  const [textWidth, setTextWidth] = useState(0);

  const MIN_WIDTH = 50;
  const MAX_WIDTH = maxWidth || 144;
  const inputRange = MIN_WIDTH === MAX_WIDTH ? [MIN_WIDTH, MIN_WIDTH + 1] : [MIN_WIDTH, MAX_WIDTH];
  const outputRange = ["#E9E9E9", color];

  const width = useSharedValue(disabled ? MIN_WIDTH : active ? MAX_WIDTH : MIN_WIDTH);
  const padding = useSharedValue(0);
  const boxPadding = useSharedValue(
    disabled
      ? 0
      : active
        ? (MAX_WIDTH - (textWidth + IMAGE_SIZE + TEXT_PADDING)) / 2 - INNER_BOX_PADDING_LEFT
        : 0
  );

  useEffect(() => {
    if (textWidth) {
      if (disabled) {
        width.value = withTiming(MIN_WIDTH, { duration: 200 });
        padding.value = withTiming(0, { duration: 200 });
        boxPadding.value = withTiming(0, { duration: 200 });
      } else {
        width.value = withTiming(active ? MAX_WIDTH : MIN_WIDTH, { duration: 300 });
        padding.value = withTiming(active ? -TEXT_TRANSLATE_X : 0, { duration: 300 });
        boxPadding.value = withTiming(
          active
            ? (MAX_WIDTH - (textWidth + IMAGE_SIZE + TEXT_PADDING)) / 2 - INNER_BOX_PADDING_LEFT
            : 0,
          { duration: 300 }
        );
      }
    }
  }, [active, textWidth, disabled]);

  const animatedStyle = useAnimatedStyle(() => {
    let bgColor = interpolateColor(width.value, inputRange, outputRange);
    if (disabled) {
      bgColor = color;
    }
    return {
      width: width.value,
      backgroundColor: bgColor,
      opacity: disabled ? 0.5 : 1,
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: padding.value }],
    opacity: disabled ? 0 : 1,
  }));

  const animatedBoxStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: boxPadding.value }],
  }));


  const iconTintColor = disabled
    ? "#A0A0A0"
    : active
      ? "#fff"
      : defaultTintColor || "#222";

  const textTintColor = disabled
    ? "#A0A0A0"
    : active
      ? "#fff"
      : defaultTintColor;

  const handlePress = disabled ? () => { } : onPress;

  return (
    <Pressable onPress={handlePress} disabled={disabled}>
      <Animated.View style={[styles.animatedBox, animatedStyle, buttonStyle]}>
        <Animated.View style={[styles.innerBox, animatedBoxStyle]}>
          <View style={styles.imageContainer}>
            {customIcon ? (
              customIcon
            ) : (
              <Animated.Image
                source={image}
                style={[styles.image, { tintColor: iconTintColor }]}
                resizeMode="contain"
              />
            )}
          </View>
          <Animated.Text
            numberOfLines={1}
            style={[
              styles.text,
              animatedTextStyle,
              textStyle,
              labelStyle,
              { color: textTintColor },
            ]}
            onLayout={(event) => setTextWidth(event.nativeEvent.layout.width)}
          >
            {disabled ? "" : label}
          </Animated.Text>
        </Animated.View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  animatedBox: {
    height: 44,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  innerBox: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    width: "100%",
    paddingLeft: INNER_BOX_PADDING_LEFT,
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
  text: {
    flex: 1,
    overflow: "hidden",
    position: "absolute",
    fontWeight: "500",
    left: INNER_BOX_PADDING_LEFT + IMAGE_SIZE + TEXT_PADDING + TEXT_TRANSLATE_X,
  },
});

export default AnimatedButton;
