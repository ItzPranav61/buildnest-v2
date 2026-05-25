"use client";

import { useState } from "react";
import { HomeScreen } from "./screens/HomeScreen";
import { LoginScreen } from "./screens/LoginScreen";

export function AaspasApp({ initialScreen }: { initialScreen?: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialScreen === "home");

  if (!isLoggedIn) {
    return <LoginScreen onContinue={() => setIsLoggedIn(true)} />;
  }

  return <HomeScreen />;
}
