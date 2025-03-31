import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedButtonList from './components/AnimatedButton';

const buttonConfigs = [
  {
    label: "Primary",
    defaultImage: require('./assets/apple-email/profile-default.png'),
    activeImage: require('./assets/apple-email/profile-white.png'),
    color: '#0B75DF',
  },
  {
    label: "Transactions",
    defaultImage: require('./assets/apple-email/cart-default.png'),
    activeImage: require('./assets/apple-email/cart-white.png'),
    color: '#25A344',
  },
  {
    label: "Updates",
    defaultImage: require('./assets/apple-email/chat-default.png'),
    activeImage: require('./assets/apple-email/chat-white.png'),
    color: '#5150C9',
  },
  {
    label: "Promotions",
    defaultImage: require('./assets/apple-email/mega-default.png'),
    activeImage: require('./assets/apple-email/mega-white.png'),
    color: '#E43257',
  },
];

export default function AppleEmail() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {buttonConfigs.map((btn, index) => (
          <AnimatedButtonList
            key={btn.label}
            label={btn.label}
            active={activeIndex === index}
            onPress={() => setActiveIndex(index)}
            defaultImage={btn.defaultImage}
            activeImage={btn.activeImage}
            color={btn.color}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});