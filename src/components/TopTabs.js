import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";
import AnimatedButton from "./AnimatedButton";
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
export default function TopTabs({ tabs, initialIndex = 0, syncWithRouter = false, separate = false, onTabChange, }) {
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
    // Warn if using experimental path sync
    React.useEffect(() => {
        if (routerSyncType === "path") {
            console.warn("[TopTabs] syncWithRouter type 'path' is experimental and may not work perfectly in all routing setups. This will be improved in the next update.");
        }
    }, [routerSyncType]);
    // Update index when router changes
    useEffect(() => {
        if (!routerSyncType)
            return;
        if (routerSyncType === "param" && searchParams.tab) {
            const index = tabs.findIndex((t) => t.tabKey === searchParams.tab?.toString());
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
        if (!routerSyncType || !mounted || !activeTab)
            return;
        if (routerSyncType === "param" && activeTab.tabKey !== searchParams.tab?.toString()) {
            InteractionManager.runAfterInteractions(() => {
                try {
                    router.replace({ pathname, params: { tab: activeTab.tabKey } });
                }
                catch (err) {
                    console.warn(`[TopTabs] Failed to sync with router (param mode).\nMake sure your project has <Slot /> in the root layout when using syncWithRouter.`, err);
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
                    }
                    catch (err) {
                        console.warn(`[TopTabs] Failed to sync with router (path mode).\nMake sure your project has <Slot /> in the root layout when using syncWithRouter.`, err);
                    }
                });
            }
        }
        if (activeTab && onTabChange)
            onTabChange(activeTab);
    }, [activeIndex, mounted]);
    const handlePress = (index) => {
        setActiveIndex(index);
    };
    const ActiveScreen = tabs[activeIndex]?.component;
    return (<View style={styles.container}>

      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (<AnimatedButton key={tab.tabKey} label={tab.label} active={index === activeIndex} onPress={() => handlePress(index)} image={tab.image} color={tab.defaultTint} activeTintColor={tab.activeTint} defaultTintColor={tab.defaultTint}/>))}
      </View>

      {/* Separator (optional) */}
      {separate && (<View style={{
                height: 1,
                width: "100%",
                backgroundColor: "transparent",
                marginVertical: 8,
            }}/>)}

      {/* Active screen */}
      <View style={{ flex: 1, width: "100%" }}>
        {ActiveScreen && <ActiveScreen />}
      </View>
    </View>);
}
const styles = StyleSheet.create({
    container: { width: "100%", flex: 1, alignItems: "center" },
    tabBar: { flexDirection: "row", alignItems: "center", gap: 10 },
});
