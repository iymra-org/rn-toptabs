import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";
import AnimatedButton from "./AnimatedButton";

/**
 * Configuration for a single tab in TopTabs.
 *
 * @property label Display text for the tab.
 * @property image Icon/image for the tab (require or URI).
 * @property activeTint Color when tab is active.
 * @property defaultTint Color when tab is inactive.
 * @property component React component to render for this tab.
 * @property tabKey Unique key for the tab (used for routing).
 */
export interface TabButtonConfig {
  /** Display text for the tab. */
  label: string;
  /** Icon/image for the tab (require or URI). */
  image: any;
  /** Color when tab is active. */
  activeTint: string;
  /** Color when tab is inactive. */
  defaultTint: string;
  /** React component to render for this tab. */
  component: React.ComponentType<any>;
  /** Unique key for the tab (used for routing). */
  tabKey: string;
}

/**
 * Router sync configuration for TopTabs.
 *
 * @property type "param" (default) - syncs tab state with query param (e.g. ?tab=chat)
 * @property type "path" - syncs tab state with last path segment (e.g. /chat)
 */
export interface SyncWithRouterConfig {
  /**
   * Router sync mode: "param" for query param, "path" for path segment.
   * "param" will use ?tab=tabKey, "path" will use /tabKey in the URL.
   */
  type: "path" | "param";
}

/**
 * Props for TopTabs component.
 *
 * @property tabs Array of tab definitions.
 * @property initialIndex Initial active tab index (default: 0).
 * @property syncWithRouter Router sync option. Boolean (default: false) or object with type "param" or "path".
 * @property separate Show a separator line below the tab bar.
 * @property onTabChange Callback triggered whenever the active tab changes.
 */
export interface TopTabsProps {
  /** Array of tab definitions. */
  tabs: TabButtonConfig[];
  /** Initial active tab index (default: 0). */
  initialIndex?: number;
  /**
   * Router sync option. Boolean (default: false) or object with type "param" or "path".
   * If true, uses query param sync (?tab=tabKey). If object, uses specified type:
   *   - "param": URL will be /?tab=chat (tab state in query param)
   *   - "path": URL will be /chat (tab state in last path segment)
   *
   * Result:
   *   - When tab changes, URL updates accordingly.
   *   - Deep linking and browser navigation will select correct tab.
   *   - Use "param" for compatibility with query-based routing, "path" for cleaner URLs.
   */
  syncWithRouter?: boolean | SyncWithRouterConfig;
  /** Show a separator line below the tab bar. */
  separate?: boolean;
  /** Callback triggered whenever the active tab changes. */
  onTabChange?: (tab: TabButtonConfig) => void;
}

/**
 * Animated top tab bar component with router sync and customizable tabs.
 *
 * Features:
 * - Customizable tab bar with animated buttons
 * - Syncs tab state with router (query param or path segment)
 * - Flexible tab configuration and callback
 *
 * @param tabs Array of tab definitions
 * @param initialIndex Initial active tab index
 * @param syncWithRouter Router sync option (boolean or { type: "param" | "path" })
 * @param separate Show separator line below tab bar
 * @param onTabChange Callback for tab change
 */
export default function TopTabs({
  tabs,
  initialIndex = 0,
  syncWithRouter = false,
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

  // Determine router sync mode
  const routerSyncType = typeof syncWithRouter === "object" ? syncWithRouter.type : (syncWithRouter ? "param" : undefined);

  // Update index when router changes
  useEffect(() => {
    if (!routerSyncType) return;

    if (routerSyncType === "param" && searchParams.tab) {
      const index = tabs.findIndex(
        (t) => t.tabKey === searchParams.tab?.toString()
      );
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
      }
    }

    if (routerSyncType === "path") {
      // Get last segment from pathname
      const segments = pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      const index = tabs.findIndex((t) => t.tabKey === last);
      if (index !== -1 && index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  }, [searchParams, pathname]);

  // Sync router safely when tab changes
  useEffect(() => {
    const activeTab = tabs[activeIndex];
    if (!routerSyncType || !mounted || !activeTab) return;

    if (routerSyncType === "param" && activeTab.tabKey !== searchParams.tab?.toString()) {
      InteractionManager.runAfterInteractions(() => {
        try {
          router.replace({ pathname, params: { tab: activeTab.tabKey } });
        } catch (err) {
          console.warn(
            `[TopTabs] Failed to sync with router (param mode).\nMake sure your project has <Slot /> in the root layout when using syncWithRouter.`,
            err
          );
        }
      });
    }

    if (routerSyncType === "path") {
      const segments = pathname.split("/").filter(Boolean);
      const last = segments[segments.length - 1];
      if (activeTab.tabKey !== last) {
        InteractionManager.runAfterInteractions(() => {
          try {
            // Replace last segment with tabKey
            const newPath = segments.slice(0, -1).concat(activeTab.tabKey).join("/");
            router.replace("/" + newPath);
          } catch (err) {
            console.warn(
              `[TopTabs] Failed to sync with router (path mode).\nMake sure your project has <Slot /> in the root layout when using syncWithRouter.`,
              err
            );
          }
        });
      }
    }

    if (activeTab && onTabChange) onTabChange(activeTab);
  }, [activeIndex, mounted]);

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
