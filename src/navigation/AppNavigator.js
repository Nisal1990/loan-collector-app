import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'nativewind';
import BottomTabs from './BottomTabs';
import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import BorrowerProfileScreen from '../screens/BorrowerProfileScreen';
import LoanPaymentScreen from '../screens/LoanPaymentScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, loading } = React.useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-dark dark:bg-slate-900">
        <Text className="text-white text-lg font-semibold">Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: isDark ? '#0F172A' : '#F8F8F8' } }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={BottomTabs} />
            <Stack.Screen name="BorrowerProfile" component={BorrowerProfileScreen} />
            <Stack.Screen name="LoanPayment" component={LoanPaymentScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
