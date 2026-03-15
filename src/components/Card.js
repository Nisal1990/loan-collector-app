import React from "react";
import { View } from "react-native";

export default function Card({ children, className = "", noPadding = false }) {
  return (
    <View className={`bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 ${noPadding ? "" : "p-4"} ${className}`}>
      {children}
    </View>
  );
}
