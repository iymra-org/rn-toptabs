import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";
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
  syncWithRouter = false, // default: safe (no router sync)
  separate = false,
  onTabChange,
}: TopTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useLocalSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Mark as mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update index when searchParams change
  useEffect(() => {
    if (syncWithRouter && searchParams.tab) {
      const index = tabs.findIndex(
        (t) => t.tabKey === searchParams.tab?.toString()
      );
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  }, [searchParams]);

  // Sync router safely when tab changes
  useEffect(() => {
    const activeTab = tabs[activeIndex];
    if (!syncWithRouter || !mounted || !activeTab) return;

    if (activeTab.tabKey !== searchParams.tab?.toString()) {
      InteractionManager.runAfterInteractions(() => {
        try {
          router.replace({ pathname, params: { tab: activeTab.tabKey } });
        } catch (err) {
          console.warn(
            `[TopTabs] Failed to sync with router. 
Make sure your project has <Slot /> in the root layout when using syncWithRouter.`,
            err
          );
        }
      });
    }

    if (activeTab && onTabChange) onTabChange(activeTab);
  }, [activeIndex, mounted]);

  const handlePress = (index: number) => {
    setActiveIndex(index);
  };

  const ActiveScreen = tabs[activeIndex]?.component;

  return (
    <View style={styles.container}>
      {/* Tab bar */}
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

      {/* Separator (optional) */}
      {separate && (
        <View
          style={{
            height: 1,
            width: "100%",
            backgroundColor: "transparent",
            marginVertical: 8,
          }}
        />
      )}

      {/* Active screen */}
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
