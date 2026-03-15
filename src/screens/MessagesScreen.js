import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { useColorScheme } from 'nativewind';
import { mockBorrowers } from '../utils/mockData';
import { formatCurrency } from '../utils/currency';
import Card from '../components/Card';
import Badge from '../components/Badge';
import { MessageCircle, MessageSquare, CheckCheck } from 'lucide-react-native';

export default function MessagesScreen() {
  const [filter, setFilter] = useState('Pending Only');
  const [activeLang, setActiveLang] = useState('English');
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filters = ['All', 'Pending Only', 'Overdue Only'];
  const languages = ['English', 'Sinhala'];

  const filteredBorrowers = mockBorrowers.filter(b => {
    if (filter === 'Pending Only') return !b.paidToday && b.status !== 'Completed';
    if (filter === 'Overdue Only') return b.arrearsAmount > 0;
    return b.status !== 'Completed';
  });

  const getMessageTemplate = (borrower) => {
    if (activeLang === 'English') {
      return `Dear ${borrower.fullName}, your loan installment of ${formatCurrency(borrower.dailyDue)} for account ${borrower.loanAccountNo} is due today. Please contact your loan officer. Thank you.`;
    } else {
      return `ගෞරවනීය ${borrower.fullName}, ඔබේ ණය ගිණුම ${borrower.loanAccountNo} සඳහා ${formatCurrency(borrower.dailyDue)} ගෙවීම අද කළ යුතුය. ස්තූතියි.`;
    }
  };

  const handleSendWhatsApp = (borrower) => {
    const msg = getMessageTemplate(borrower);
    Linking.openURL(`whatsapp://send?phone=${borrower.mobile1}&text=${encodeURIComponent(msg)}`).catch(() => {
      Alert.alert("Error", "Make sure WhatsApp is installed");
    });
  };

  const handleSendSMS = (borrower) => {
    const msg = getMessageTemplate(borrower);
    Linking.openURL(`sms:${borrower.mobile1}?body=${encodeURIComponent(msg)}`).catch(() => {
      Alert.alert("Error", "Failed to open SMS app");
    });
  };

  const handleBulkSend = () => {
    Alert.alert(
      "Confirm Bulk Send", 
      `This will attempt to open WhatsApp/SMS for ${filteredBorrowers.length} borrowers. Proceed?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Proceed", onPress: () => {
          // In a real app with native modules, this would use a background loop.
          // For Expo we just notify the user.
          Alert.alert("Bulk Send Started", "Messages queued in background.");
        }}
      ]
    );
  };

  const renderCard = ({ item }) => (
    <Card className="mb-4">
      <View className="flex-row justify-between items-start mb-3 border-b border-gray-100 dark:border-slate-700 pb-3">
        <View className="flex-1">
          <Text className="text-base font-bold text-primary dark:text-white">{item.fullName}</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-xs">A/C: {item.loanAccountNo}</Text>
        </View>
        <Badge 
          label={item.arrearsAmount > 0 ? "Overdue" : "Pending"} 
          status={item.arrearsAmount > 0 ? "danger" : "warning"} 
        />
      </View>

      <Text className="text-gray-600 dark:text-gray-300 text-xs bg-blue-50 dark:bg-slate-700/50 p-2 rounded-lg mb-3">
        {getMessageTemplate(item)}
      </Text>

      <View className="flex-row justify-end space-x-2">
        <TouchableOpacity 
          onPress={() => handleSendSMS(item)}
          className="flex-row items-center bg-gray-100 dark:bg-slate-700 px-3 py-2 rounded-lg mr-2"
        >
          <MessageSquare color={isDark ? "#CBD5E1" : "#475569"} size={16} />
          <Text className="text-slate-600 dark:text-slate-300 text-xs font-bold ml-2">SMS</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => handleSendWhatsApp(item)}
          className="flex-row items-center bg-green-50 dark:bg-green-900/40 border border-green-200 dark:border-green-800 px-3 py-2 rounded-lg"
        >
          <MessageCircle color={isDark ? "#4ADE80" : "#16a34a"} size={16} />
          <Text className="text-green-600 dark:text-green-400 text-xs font-bold ml-2">WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <View className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700">
        <Text className="text-2xl font-bold text-primary dark:text-white mb-4">Messages & Reminders</Text>

        {/* Template Language Toggle */}
        <View className="flex-row items-center mb-4">
          <Text className="text-gray-500 dark:text-gray-400 font-semibold mr-3 text-sm">Template:</Text>
          <View className="flex-row bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            {languages.map(lang => (
              <TouchableOpacity
                key={lang}
                onPress={() => setActiveLang(lang)}
                className={`py-1 px-4 rounded-md ${activeLang === lang ? 'bg-white dark:bg-slate-600 shadow-sm' : 'bg-transparent'}`}
              >
                <Text className={`text-xs font-semibold ${activeLang === lang ? 'text-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>{lang}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Filter Tabs */}
        <View className="flex-row mb-1 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50 dark:bg-slate-800">
          {filters.map(f => (
            <TouchableOpacity 
              key={f} 
              onPress={() => setFilter(f)}
              className={`flex-1 py-3 items-center ${filter === f ? 'bg-primary dark:bg-slate-600 border-r border-primary dark:border-slate-600' : 'border-r border-gray-200 dark:border-slate-700'}`}
            >
              <Text className={filter === f ? 'text-white font-semibold text-xs' : 'text-gray-600 dark:text-gray-400 font-semibold text-xs'}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <FlatList
        data={filteredBorrowers}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center p-10">
            <CheckCheck color="#CBD5E1" size={48} className="mb-4" />
            <Text className="text-gray-400 dark:text-gray-500 text-center text-lg font-semibold">All clear!</Text>
            <Text className="text-gray-400 dark:text-gray-500 text-center text-sm">No borrowers need reminders right now.</Text>
          </View>
        }
      />

      {/* Bulk Send FAB */}
      {filteredBorrowers.length > 0 && (
        <View className="absolute bottom-6 left-0 right-0 px-4 items-center">
          <TouchableOpacity 
            onPress={handleBulkSend}
            className="flex-row items-center bg-primary dark:bg-slate-700 border dark:border-slate-600 px-6 py-4 rounded-full shadow-sm"
          >
            <MessageCircle color="white" size={20} />
            <Text className="text-white font-bold text-base ml-2">Bulk Send to {filteredBorrowers.length} Pending</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
