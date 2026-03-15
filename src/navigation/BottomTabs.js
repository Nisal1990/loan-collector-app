import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Users, Wallet, MessageSquare, User } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

import DashboardScreen from '../screens/DashboardScreen';
import BorrowersListScreen from '../screens/BorrowersListScreen';
import CollectionsScreen from '../screens/CollectionsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1D9E75', // Accent Green
        tabBarInactiveTintColor: isDark ? '#64748B' : '#94A3B8', // Slate 500 / Slate 400
        tabBarStyle: {
          backgroundColor: isDark ? '#1E293B' : '#ffffff', // Slate 800 / White
          borderTopWidth: 1,
          borderTopColor: isDark ? '#334155' : '#f1f5f9', // Slate 700 / Slate 100
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Home color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Borrowers" 
        component={BorrowersListScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Users color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Collections" 
        component={CollectionsScreen} 
        options={{ tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen} 
        options={{ tabBarIcon: ({ color, size }) => <MessageSquare color={color} size={size} /> }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({ color, size }) => <User color={color} size={size} /> }} 
      />
    </Tab.Navigator>
  );
}
