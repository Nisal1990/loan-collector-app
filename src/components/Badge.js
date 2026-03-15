import React from "react";
import { View, Text } from "react-native";

export default function Badge({ label, status = 'default', className = "" }) {
  const variants = {
    success: "bg-accent/20 border-accent",
    warning: "bg-warning/20 border-warning",
    danger: "bg-danger/20 border-danger",
    default: "bg-gray-200 dark:bg-slate-700 border-gray-300 dark:border-slate-600",
  };

  const textVariants = {
    success: "text-accent",
    warning: "text-warning",
    danger: "text-danger",
    default: "text-gray-700 dark:text-gray-300",
  };

  return (
    <View className={`px-3 py-1 rounded-full border ${variants[status]} ${className}`}>
      <Text className={`text-xs font-bold ${textVariants[status]}`}>
        {label}
      </Text>
    </View>
  );
}
