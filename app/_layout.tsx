import React, { useState } from "react";
import { Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { TabButtonConfig, TopTabs } from "../src";


const tabs = [
    {
        label: "Chat",
        tabKey: "chat",
        image: require("../assets/icon/chat-default.png"),
        activeTint: "#fff",
        defaultTint: "#0B75DF",
        component: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Home Page</Text>
            </View>
        ),
    },
    {
        label: "Cart",
        tabKey: "cart",
        image: require("../assets/icon/cart-white.png"),
        activeTint: "#fff",
        defaultTint: "#5150C9",
        component: () => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Settings Page</Text>
            </View>
        ),
    },
];

export default function App() {

    const [activeTab, setActiveTab] = useState<TabButtonConfig>(tabs[0]);
    console.log(activeTab.label)

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <SafeAreaView style={{
                    flex: 1,
                }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <TopTabs tabs={tabs} syncWithRouter={true} onTabChange={setActiveTab} />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
