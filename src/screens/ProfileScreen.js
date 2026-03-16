import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const collectedToday = 104000;
  const progressPerc = Math.min((collectedToday / targetToday) * 100, 100) || 0;

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <ScrollView className="flex-1 px-4 pt-6 pb-20">
        
        <View className="items-center mb-6 mt-4">
          <View className="w-28 h-28 rounded-full bg-dark dark:bg-slate-700 items-center justify-center mb-4 border-4 border-white dark:border-slate-800 shadow-lg">
            <Text className="text-3xl font-bold text-white">{user?.name?.split(' ').map(n => n[0]).join('')}</Text>
          </View>
          <Text className="text-2xl font-bold text-dark dark:text-white">{user?.name}</Text>
          <Text className="text-slate-500 dark:text-slate-400 font-medium">Loan Officer • {user?.id}</Text>
        </View>

        {/* Theme Preferences */}
        <Card className="mb-6 p-5">
          <Text className="font-bold text-dark dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Preferences</Text>
          <View className="flex-row items-center justify-between mt-1">
            <View className="flex-row items-center">
              {isDark ? <Moon color="#94A3B8" size={18} /> : <Sun color="#F59E0B" size={18} />}
              <Text className="text-slate-600 dark:text-slate-300 ml-3 font-medium">Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleColorScheme}
              trackColor={{ false: "#E2E8F0", true: "#FF131D" }}
              thumbColor={"#ffffff"}
            />
          </View>
        </Card>

        <Card className="mb-6 p-5">
          <Text className="font-bold text-dark dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Assignment Details</Text>
          
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-primary-50 dark:bg-red-900/30 items-center justify-center">
              <MapPin color={isDark ? "#FCA5A5" : "#FF131D"} size={16} />
            </View>
            <Text className="text-slate-600 dark:text-slate-400 ml-3">Branch Location</Text>
            <Text className="flex-1 text-right font-medium text-dark dark:text-white">{user?.branch}</Text>
          </View>
          
          <View className="flex-row items-center mb-3">
            <View className="w-8 h-8 rounded-full bg-primary-50 dark:bg-red-900/30 items-center justify-center">
              <Map color={isDark ? "#FCA5A5" : "#FF131D"} size={16} />
            </View>
            <Text className="text-slate-600 dark:text-slate-400 ml-3">Coverage Zone</Text>
            <Text className="flex-1 text-right font-medium text-dark dark:text-white">Western Region</Text>
          </View>
        </Card>

        <Card className="mb-6 p-5">
          <Text className="font-bold text-dark dark:text-white border-b border-slate-100 dark:border-slate-700 pb-2 mb-3">Contact Information</Text>
          
          <View className="flex-row items-center mb-3 mt-1">
            <View className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center">
              <Phone color="#94A3B8" size={16} />
            </View>
            <Text className="text-slate-600 dark:text-slate-400 ml-3 font-medium">+94 77 123 4567</Text>
          </View>
          
          <View className="flex-row items-center">
            <View className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center">
              <Mail color="#94A3B8" size={16} />
            </View>
            <Text className="text-slate-600 dark:text-slate-400 ml-3 font-medium">nimal.p@loancollect.lk</Text>
          </View>
        </Card>

        <Card className="mb-8 p-5 bg-primary-50 border-primary-100 dark:bg-slate-800 dark:border-slate-700">
          <View className="flex-row justify-between items-center border-b border-primary-200 dark:border-slate-700 pb-2 mb-4">
            <View className="flex-row items-center">
              <Award color={isDark ? "#FCA5A5" : "#FF131D"} size={20} />
              <Text className="font-bold text-dark dark:text-white ml-2">Today's Performance</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-slate-600 dark:text-slate-400">Daily Target</Text>
            <Text className="font-bold text-dark dark:text-white">{formatCurrency(targetToday)}</Text>
          </View>
          
          <View className="flex-row justify-between mb-4">
            <Text className="text-slate-600 dark:text-slate-400">Achieved</Text>
            <Text className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(collectedToday)}</Text>
          </View>

          <View className="h-2.5 w-full bg-primary-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${progressPerc}%` }}
            />
          </View>
          <Text className="text-center text-xs font-bold text-primary dark:text-red-400">{progressPerc.toFixed(0)}% Completed</Text>
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
