import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AnimatedButton from "./AnimatedButton";

export interface TabButtonConfig {
  label: string;
  image: any;
  activeTint: string;
  defaultTint: string;
  component: React.ComponentType<any>;
  tabKey: string;
}

interface TopTabsProps {
  tabs: TabButtonConfig[];
  initialIndex?: number;
  syncWithRouter?: boolean;
  separate?: boolean;
  onTabChange?: (tab: TabButtonConfig) => void;
}

export default function TopTabs({
  tabs,
  initialIndex = 0,
  syncWithRouter = true,
  separate = false,
  onTabChange,
}: TopTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);


  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (syncWithRouter && searchParams.tab) {
      const index = tabs.findIndex((t) => t.tabKey === searchParams.tab?.toString());
      if (index !== -1 && index !== activeIndex) setActiveIndex(index);
    }
  }, [searchParams]);


  useEffect(() => {
    const activeTab = tabs[activeIndex];

    if (syncWithRouter && mounted && activeTab) {
      if (activeTab.tabKey !== searchParams.tab?.toString()) {
        router.replace({ pathname, params: { tab: activeTab.tabKey } });
      }
    }


    if (activeTab && onTabChange) onTabChange(activeTab);
  }, [activeIndex]);

  const handlePress = (index: number) => {
    setActiveIndex(index);
  };

  const ActiveScreen = tabs[activeIndex]?.component;

  return (
    <View style={styles.container}>

      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <AnimatedButton
            key={tab.tabKey}
            label={tab.label}
            active={index === activeIndex}
            onPress={() => handlePress(index)}
            image={tab.image}
            color={tab.defaultTint}
            activeTintColor={tab.activeTint}
            defaultTintColor={tab.defaultTint}
          />
        ))}
      </View>


      {separate && (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "#F3F6FF",
            marginVertical: 8,
          }}
        />
      )}


      <View style={{ flex: 1, width: "100%" }}>
        {ActiveScreen && <ActiveScreen />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "100%", flex: 1, alignItems: "center" },
  tabBar: { flexDirection: "row", alignItems: "center", gap: 10 },
});
