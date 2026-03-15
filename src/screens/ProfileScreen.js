import React, { useContext } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useColorScheme } from 'nativewind';
import { LogOut, MapPin, Phone, Mail, Award, Map, Sun, Moon } from 'lucide-react-native';
import Card from '../components/Card';
import Button from '../components/Button';
import { formatCurrency } from '../utils/currency';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const targetToday = user?.targetToday || 0;
  // Mock collected value
  const collectedToday = 104000;
  const progressPerc = Math.min((collectedToday / targetToday) * 100, 100) || 0;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <ScrollView className="flex-1 px-4 pt-6 pb-20">
        
        <View className="items-center mb-6 mt-4">
          <View className="w-28 h-28 rounded-full bg-primary dark:bg-slate-700 items-center justify-center mb-4 border-4 border-white dark:border-slate-800 shadow-sm">
            <Text className="text-3xl font-bold text-white">{user?.name?.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <Text className="text-2xl font-bold text-primary dark:text-white">{user?.name}</Text>
          <Text className="text-gray-500 dark:text-gray-400 font-medium">Loan Officer • {user?.id}</Text>
        </View>

        {/* Theme Preferences */}
        <Card className="mb-6 p-5">
          <Text className="font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-3">Preferences</Text>
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center">
              {isDark ? <Moon color="#94A3B8" size={18} /> : <Sun color="#94A3B8" size={18} />}
              <Text className="text-gray-600 dark:text-gray-300 ml-3 font-medium">Dark Mode Switch</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#cbd5e1", true: "#1D9E75" }}
              thumbColor={"#ffffff"}
            />
          </View>
        </Card>

        <Card className="mb-6 p-5">
          <Text className="font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-3">Assignment Details</Text>
          
          <View className="flex-row items-center mb-3">
            <MapPin color="#94A3B8" size={18} />
            <Text className="text-gray-600 dark:text-gray-400 ml-3">Branch Location</Text>
            <Text className="flex-1 text-right font-medium text-primary dark:text-white">{user?.branch}</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <Map color="#94A3B8" size={18} />
            <Text className="text-gray-600 dark:text-gray-400 ml-3">Coverage Zone</Text>
            <Text className="flex-1 text-right font-medium text-primary dark:text-white">Western Region</Text>
          </View>
        </Card>

        <Card className="mb-6 p-5">
          <Text className="font-bold text-primary dark:text-white border-b border-gray-100 dark:border-slate-700 pb-2 mb-3">Contact Information</Text>
          
          <View className="flex-row items-center mb-3 mt-1">
            <Phone color="#94A3B8" size={18} />
            <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">+94 77 123 4567</Text>
          </View>
          
          <View className="flex-row items-center">
            <Mail color="#94A3B8" size={18} />
            <Text className="text-gray-600 dark:text-gray-400 ml-3 font-medium">nimal.p@loancollect.lk</Text>
          </View>
        </Card>

        <Card className="mb-8 p-5 bg-blue-50 border-blue-100 dark:bg-slate-800/80 dark:border-slate-700">
          <View className="flex-row justify-between items-center border-b border-blue-200 dark:border-slate-700 pb-2 mb-4">
            <View className="flex-row items-center">
              <Award color="#1D9E75" size={20} />
              <Text className="font-bold text-primary dark:text-white ml-2">Today's Performance</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600 dark:text-gray-400">Daily Target</Text>
            <Text className="font-bold text-primary dark:text-white">{formatCurrency(targetToday)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-gray-600 dark:text-gray-400">Achieved</Text>
            <Text className="font-bold text-accent">{formatCurrency(collectedToday)}</Text>
          </View>

          <View className="h-2 w-full bg-blue-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
            <View 
              className="h-full bg-accent rounded-full" 
              style={{ width: `${progressPerc}%` }}
            />
          </View>
          <Text className="text-center text-xs font-bold text-accent">{progressPerc.toFixed(0)}% Completed</Text>
        </Card>

        <Button 
          title="Sign Out" 
          variant="danger"
          icon={<LogOut color="white" size={18} />}
          onPress={logout}
          className="mb-10 w-[80%] self-center"
        />

      </ScrollView>
    </SafeAreaView>
  );
}
