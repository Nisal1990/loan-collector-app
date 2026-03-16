import React from "react";
import { View, Text } from "react-native";

export default function Badge({ label, status = 'default', className = "" }) {
  const variants = {
    success: "bg-emerald-100 dark:bg-emerald-900/40 border-emerald-300 dark:border-emerald-700",
    warning: "bg-amber-100 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700",
    danger: "bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700",
    default: "bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600",
  };

  const textVariants = {
    success: "text-emerald-700 dark:text-emerald-400",
    warning: "text-amber-700 dark:text-amber-400",
    danger: "text-red-700 dark:text-red-400",
    default: "text-slate-600 dark:text-slate-300",
  };

  return (
    <View className={`px-3 py-1 rounded-full border ${variants[status]} ${className}`}>
      <Text className={`text-xs font-bold ${textVariants[status]}`}>
        {label}
      </Text>
    </View>
  );
}
