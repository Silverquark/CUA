import "expo-dev-client";
import React from "react";
import { Provider } from "app/provider";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, Tabs } from "expo-router";

import {
  Anchor,
  Button,
  H1,
  H3,
  Paragraph,
  Separator,
  XStack,
  YStack,
  Stack as TgStack,
  Switch,
  ScrollView,
  Image,
  H5,
} from "@my/ui";
import { View } from "react-native";

import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from "@react-navigation/native";

export default function App() {
  const [loaded] = useFonts({
    Inter: require("@tamagui/font-inter/otf/Inter-Medium.otf"),
    InterBold: require("@tamagui/font-inter/otf/Inter-Bold.otf"),
  });

  if (!loaded) {
    return <SplashScreen />;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Provider defaultTheme="light">
        <Stack screenOptions={{}}></Stack>
      </Provider>
    </ThemeProvider>
  );
}

// headerStyle: {
//   backgroundColor: "#f4511e",
// },
// headerTintColor: "#fff",
// headerTitleStyle: {
//   fontWeight: "bold",
// },
