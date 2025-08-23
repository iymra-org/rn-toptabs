# **Iymra UI TopTabs Package**

A smooth and interactive animated top tab bar inspired by Apple’s Mail app, built with **React Native**, **Reanimated**, and **Expo**. Perfect for creating engaging top-navigation experiences in your mobile apps.


## **Features**

* **Customizable dynamic TopTabs** (`TopTabs`) component
* Full **TypeScript support**
* **Easy integration** with Expo/React Native projects
* Supports **custom icons** and **titles**
* **Reactive tab change callback** via `onTabChange`
* **Smooth routing integration** with `expo-router`
* Flexible rendering of **tab-specific components**


## **Installation**

```bash
# npm
npm install rn-toptabs

# yarn
yarn add rn-toptabs

# bun
bun add rn-toptabs
```


## **Usage Example**

```tsx
import React, { useState } from "react";
import { View, Text } from "react-native";
import TopTabs, { TabButtonConfig } from "rn-toptabs";

const Chat = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Chat Page</Text>
    </View>
  )
}

const tabs: TabButtonConfig[] = [
  {
    label: "Chat",
    tabKey: "chat",
    image: require("../assets/icon/chat-default.png"),
    activeTint: "#fff",
    defaultTint: "#0B75DF",
    component: Chat
  },
  {
    label: "Cart",
    tabKey: "cart",
    image: require("../assets/icon/cart-white.png"),
    activeTint: "#fff",
    defaultTint: "#5150C9",
    component: () => (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cart Page</Text>
      </View>
    ),
  },
];

export default function App() {
  // Optional: Get reactive active tab object
  const [activeTab, setActiveTab] = useState<TabButtonConfig>(tabs[0]);

  return (
    <View style={{ flex: 1 }}>
      <TopTabs
        tabs={tabs}
        syncWithRouter={true}   // Enable URL sync
        separate                // Optional separator below tab bar
        onTabChange={setActiveTab} // Reactive tab state callback
      />
    </View>
  );
}
```


## **TopTabs Props**

| Prop             | Type                             | Description                                        |
| ---------------- | -------------------------------- | -------------------------------------------------- |
| `tabs`           | `TabButtonConfig[]`              | Array of tab definitions                           |
| `initialIndex`   | `number`                         | Initial active tab index (default: `0`)            |
| `syncWithRouter` | `boolean`                        | Sync active tab with URL query (`expo-router`)     |
| `separate`       | `boolean`                        | Show a separator line below the tab bar            |
| `onTabChange`    | `(tab: TabButtonConfig) => void` | Callback triggered whenever the active tab changes |


## **TabButtonConfig**

| Prop          | Type                       | Description                      |
| ------------- | -------------------------- | -------------------------------- |
| `label`       | `string`                   | Tab title                        |
| `tabKey`      | `string`                   | Unique key for the tab           |
| `image`       | `any`                      | Tab icon                         |
| `activeTint`  | `string`                   | Color when tab is active         |
| `defaultTint` | `string`                   | Default tab color                |
| `component`   | `React.ComponentType<any>` | Component to render for this tab |



## **Router Sync (`syncWithRouter`)**

`TopTabs` can automatically **sync the active tab with your URL** using **`expo-router`**, enabling:

* Deep linking to specific tabs
* Preserving tab state across navigation
* Bookmarkable tab URLs

### **How It Works**

1. **Sync from URL on mount**
   If `syncWithRouter` is enabled and the URL contains a `tab` query parameter, `TopTabs` will automatically select the corresponding tab.

   ```ts
   // Example URL: /app?tab=cart
   // "Cart" tab will be active on load
   ```

2. **Update URL on tab change**
   When a user selects a tab, `TopTabs` updates the URL query automatically:

   ```ts
   // Active tab: "Chat"
   // URL updates to: /app?tab=chat
   ```

3. **Works with browser history & deep links**
   Users can share links with a specific tab selected or navigate back/forward while keeping the tab state intact.

4. **Optional reactive tab state**
   Use the `onTabChange` callback to **get the active tab object** whenever it changes:

   ```tsx
   <TopTabs
     tabs={tabs}
     syncWithRouter
     onTabChange={(tab) => console.log("Current tab:", tab.label)}
   />
   ```

---

## **Notes**

* Prefer using the `onTabChange` callback instead of global state for active tab data.
* Works seamlessly with `expo-router` for consistent URL-based tab state.
* Optional separator can be enabled with the `separate` prop.
* Supports **custom tab icons**, **tint colors**, and **dynamic components** per tab.

