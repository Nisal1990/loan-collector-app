import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";

export default function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  className = "",
  textClassName = "",
  icon = null
}) {
  const baseClasses = "flex-row items-center justify-center rounded-xl";
  
  const variants = {
    primary: "bg-primary",
    secondary: "bg-gray-200 dark:bg-slate-700",
    success: "bg-accent",
    warning: "bg-warning",
    danger: "bg-danger",
    outline: "bg-transparent border border-primary dark:border-slate-400",
  };

  const sizes = {
    sm: "py-2 px-4",
    md: "py-3 px-6",
    lg: "py-4 px-8",
  };

  const textVariants = {
    primary: "text-white",
    secondary: "text-gray-800 dark:text-gray-200",
    success: "text-white",
    warning: "text-white",
    danger: "text-white",
    outline: "text-primary dark:text-slate-300",
  };

  const textSizes = {
    sm: "text-sm font-semibold",
    md: "text-base font-bold",
    lg: "text-lg font-bold",
  };

  const opacity = disabled || loading ? "opacity-60" : "opacity-100";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${opacity} ${className}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'secondary' ? '#1E2A4A' : '#ffffff'} size="small" />
      ) : (
        <>
          {icon && <React.Fragment>{icon}</React.Fragment>}
          <Text className={`${textVariants[variant]} ${textSizes[size]} ${icon ? 'ml-2' : ''} ${textClassName}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
