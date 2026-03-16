import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { mockBorrowers } from '../utils/mockData';
import { formatCurrency } from '../utils/currency';
import Card from '../components/Card';
import Badge from '../components/Badge';

export default function BorrowersListScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filters = ['All', 'Active', 'Completed', 'Defaulted'];

  const filteredBorrowers = mockBorrowers.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.cif.includes(searchQuery) ||
                          b.loanAccountNo.includes(searchQuery);
    const matchesFilter = filter === 'All' || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'warning';
      case 'Completed': return 'success';
      case 'Defaulted': return 'danger';
      default: return 'default';
    }
  };

  const renderBorrowerCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('BorrowerProfile', { borrowerId: item.id })}>
      <Card className="mb-4">
        <View className="flex-row items-center mb-3">
          {item.photoUrl ? (
            <Image source={{ uri: item.photoUrl }} className="w-12 h-12 rounded-full mr-3" />
          ) : (
            <View className="w-12 h-12 rounded-full bg-primary-50 dark:bg-red-900/30 items-center justify-center mr-3">
              <Text className="text-primary dark:text-red-300 font-bold">{item.initials.split(' ').map(i => i[0]).join('')}</Text>
            </View>
          )}
          <View className="flex-1">
            <Text className="text-base font-bold text-dark dark:text-white">{item.fullName}</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs">CIF: {item.cif} • A/C: {item.loanAccountNo}</Text>
          </View>
          <Badge label={item.status} status={getStatusColor(item.status)} />
        </View>

        <View className="flex-row justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Loan Amount</Text>
            <Text className="font-semibold text-dark dark:text-white">{formatCurrency(item.loanAmount)}</Text>
          </View>
          <View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Installment</Text>
            <Text className="font-semibold text-dark dark:text-white">{formatCurrency(item.dailyDue)}</Text>
          </View>
          <View className="items-end">
            <Text className="text-slate-500 dark:text-slate-400 text-xs mb-1">Outstanding</Text>
            <Text className="font-semibold text-red-600 dark:text-red-400">{formatCurrency(item.outstanding)}</Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <Text className="text-sm text-slate-500 dark:text-slate-400">{item.gramaSeva}</Text>
          <View className="flex-row items-center bg-primary-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
            <Text className="text-primary dark:text-red-400 text-xs font-semibold mr-1">View Profile</Text>
            <ChevronRight color={isDark ? "#F87171" : "#FF131D"} size={14} />
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-dark dark:text-white mb-4">My Borrowers</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 mb-4">
          <Search color="#94A3B8" size={20} />
          <TextInput 
            className="flex-1 ml-2 text-base text-slate-800 dark:text-white"
            placeholder="Search by name, CIF, or Account No"
            placeholderTextColor={isDark ? "#64748B" : "#94A3B8"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filters */}
        <View className="flex-row mb-4">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filters.map(f => (
              <TouchableOpacity 
                key={f} 
                onPress={() => setFilter(f)}
                className={`mr-2 px-4 py-2 rounded-full border ${filter === f ? 'bg-primary border-primary' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
              >
                <Text className={filter === f ? 'text-white font-semibold text-sm' : 'text-slate-600 dark:text-slate-300 font-semibold text-sm'}>
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      <FlatList
        data={filteredBorrowers}
        keyExtractor={item => item.id}
        renderItem={renderBorrowerCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center p-10">
            <Text className="text-slate-400 dark:text-slate-500 text-center">No borrowers found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
