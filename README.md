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

const Chat = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Chat Page</Text>
  </View>
);

const Cart = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Cart Page</Text>
  </View>
);

const tabs: TabButtonConfig[] = [
  {
    label: "Chat",
    tabKey: "chat",
    image: require("../assets/icon/chat-default.png"),
    activeTint: "#fff",
    defaultTint: "#0B75DF",
    component: Chat,
  },
  {
    label: "Cart",
    tabKey: "cart",
    image: require("../assets/icon/cart-white.png"),
    activeTint: "#fff",
    defaultTint: "#5150C9",
    component: Cart,
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabButtonConfig>(tabs[0]);

  return (
    <View style={{ flex: 1 }}>
      <TopTabs
        tabs={tabs}
        syncWithRouter={{
          type : "path" // or "param for param routing sync
          }}   
        separate                // Optional separator below tab bar
        onTabChange={setActiveTab} // Reactive tab state callback
      />
    </View>
  );
}
```

## **Peer Dependencies**

This package requires the following peer dependencies in your project:

```
expo >=49.0.0
react >=17.0.0
react-native >=0.72.0
expo-router >=4.0.21
react-native-reanimated >=3.16.1
```

You must install these in your app. Any compatible version above the minimum will work—no need to match the exact version.

**Example:**

```bash
npm install expo-router@^4.0.21 react-native-reanimated@^3.16.1
```

If your project already uses these dependencies, you do not need to change anything.


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

### **Router Sync Modes**

You can choose how tab state is reflected in the URL:

#### 1. Query Param Mode (default)

```tsx
<TopTabs
  tabs={tabs}
  syncWithRouter={true} // or syncWithRouter={{ type: "param" }}
/>
```

- **Result:**
  - Tab state is synced via query param: `/?tab=chat`
  - Deep linking: `/?tab=cart` opens the "Cart" tab
  - URL updates as tab changes: `/?tab=chat`, `/?tab=cart`, etc.

#### 2. Path Segment Mode

```tsx
<TopTabs
  tabs={tabs}
  syncWithRouter={{ type: "path" }}
/>
```

- **Result:**
  - Tab state is synced via last path segment: `/app/chat`
  - Deep linking: `/cart` opens the "Cart" tab
  - URL updates as tab changes: `/chat`, `/cart`, etc.

#### 3. No Router Sync

```tsx
<TopTabs
  tabs={tabs}
  syncWithRouter={false}
/>
```

- **Result:**
  - Tab state is local only; URL does not change.

### **How It Works**

1. **Sync from URL on mount**
   - In "param" mode, if the URL contains a `tab` query parameter, TopTabs will select the corresponding tab.
   - In "path" mode, the last segment of the path is used to select the tab.

2. **Update URL on tab change**
   - In "param" mode, the URL query param updates: `/app?tab=chat`
   - In "path" mode, the last path segment updates: `/app/chat`

3. **Works with browser history & deep links**
   - Users can share links with a specific tab selected or navigate back/forward while keeping the tab state intact.

4. **Optional reactive tab state**
   - Use the `onTabChange` callback to get the active tab object whenever it changes:

   ```tsx
   <TopTabs
     tabs={tabs}
     syncWithRouter={{ type: "path" }}
     onTabChange={(tab) => console.log("Current tab:", tab.label)}
   />
   ```

---

## **Notes**

* Prefer using the `onTabChange` callback instead of global state for active tab data.
* Works seamlessly with `expo-router` for consistent URL-based tab state.
* Optional separator can be enabled with the `separate` prop.
* Supports **custom tab icons**, **tint colors**, and **dynamic components** per tab.

