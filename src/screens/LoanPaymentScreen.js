import React, { useState } from 'react';
import { View, Text, SafeAreaView, FlatList, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { format } from 'date-fns';
import { useColorScheme } from 'nativewind';
import { mockBorrowers } from '../utils/mockData';
import { formatCurrency } from '../utils/currency';
import Button from '../components/Button';
import Card from '../components/Card';
import { Search } from 'lucide-react-native';

export default function LoanPaymentScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const todayDate = format(new Date(), 'yyyy-MM-dd');

  // Filter out completed loans for payment screen
  const availableLoans = mockBorrowers.filter(b => b.status !== 'Completed' && (
    b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.loanAccountNo.includes(searchQuery)
  ));

  const handleSelectLoan = (loan) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.dailyDue.toString());
  };

  const handleConfirm = () => {
    Alert.alert("Payment Posted", `Receipt No: RCPT-${todayDate.replace(/-/g, '')}-ADMIN\nSuccessfully posted ${formatCurrency(paymentAmount)} to ${selectedLoan.loanAccountNo}`);
    setSelectedLoan(null);
    setSearchQuery('');
  };

  const renderLoanRow = ({ item }) => (
    <TouchableOpacity 
      onPress={() => handleSelectLoan(item)}
      className={`flex-row border-b border-gray-200 dark:border-slate-700 p-3 ${selectedLoan?.id === item.id ? 'bg-blue-50 dark:bg-slate-700/50' : 'bg-white dark:bg-slate-800'}`}
    >
      <Text className="flex-[2] text-xs font-medium text-primary dark:text-gray-300">{item.loanAccountNo}</Text>
      <Text className="flex-[3] text-xs font-semibold text-primary dark:text-white" numberOfLines={1}>{item.fullName}</Text>
      <Text className="flex-[2] text-xs text-right text-gray-600 dark:text-gray-400">{formatCurrency(item.loanAmount)}</Text>
      <Text className="flex-[2] text-xs text-right text-gray-500 dark:text-gray-500">{formatCurrency(item.capitalDue)}</Text>
      <Text className="flex-[2] text-xs text-right text-gray-500 dark:text-gray-500">{formatCurrency(item.interestDue)}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <View className="px-4 py-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 z-10">
        <Text className="text-xl font-bold text-primary dark:text-white mb-4">Loan Payment Entry</Text>
        
        <View className="flex-row justify-between mb-2 border-b border-gray-100 dark:border-slate-700 pb-2">
          <View className="flex-1">
            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Receipt No.</Text>
            <Text className="font-bold text-primary dark:text-gray-200">RCPT-(Auto)</Text>
          </View>
          <View className="flex-1 items-end">
            <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Date</Text>
            <Text className="font-bold text-primary dark:text-gray-200">{todayDate}</Text>
          </View>
        </View>

        <View className="flex-row items-center bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 mt-2">
          <Search color={isDark ? "#CBD5E1" : "#94A3B8"} size={16} />
          <TextInput 
            className="flex-1 ml-2 text-sm text-gray-800 dark:text-white"
            placeholder="Find Loan Account or Customer Name..."
            placeholderTextColor={isDark ? "#94A3B8" : "#A1A1AA"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View className="h-[40%] bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        {/* Table Header */}
        <View className="flex-row bg-gray-100 dark:bg-slate-700 p-3 border-b border-gray-300 dark:border-slate-600">
          <Text className="flex-[2] text-xs font-bold text-gray-600 dark:text-gray-300">Loan Account</Text>
          <Text className="flex-[3] text-xs font-bold text-gray-600 dark:text-gray-300">Name</Text>
          <Text className="flex-[2] text-xs font-bold text-gray-600 dark:text-gray-300 text-right">Amount</Text>
          <Text className="flex-[2] text-xs font-bold text-gray-600 dark:text-gray-300 text-right">Capital</Text>
          <Text className="flex-[2] text-xs font-bold text-gray-600 dark:text-gray-300 text-right">Interest</Text>
        </View>
        
        <FlatList
          data={availableLoans}
          keyExtractor={item => item.id}
          renderItem={renderLoanRow}
          showsVerticalScrollIndicator={true}
        />
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {selectedLoan ? (
          <Card>
            <View className="border-b border-gray-100 dark:border-slate-700 pb-3 mb-3">
              <Text className="text-primary dark:text-white font-bold text-base">{selectedLoan.fullName}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">{selectedLoan.loanAccountNo}</Text>
            </View>

            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Loan Amount</Text>
                <Text className="font-semibold text-primary dark:text-white">{formatCurrency(selectedLoan.loanAmount)}</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Installments Paid</Text>
                <Text className="font-semibold text-primary dark:text-white">{selectedLoan.rentalsPaid}</Text>
              </View>
            </View>

            <View className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700 mb-4 flex-row justify-between">
              <View className="flex-1">
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Capital Brkdn.</Text>
                <Text className="font-medium text-primary dark:text-white">{formatCurrency(selectedLoan.capitalDue)}</Text>
              </View>
              <View className="flex-[0.2] items-center justify-center">
                <Text className="text-gray-400 dark:text-gray-500 font-bold">+</Text>
              </View>
              <View className="flex-1 items-end">
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Interest Brkdn.</Text>
                <Text className="font-medium text-primary dark:text-white">{formatCurrency(selectedLoan.interestDue)}</Text>
              </View>
            </View>

            <View className="flex-row items-center border border-gray-200 dark:border-slate-600 rounded-lg p-3 mb-4 bg-white dark:bg-slate-700">
              <View className="w-4 h-4 rounded-full border-4 border-accent items-center justify-center mr-3" />
              <Text className="text-primary dark:text-white font-bold flex-1">CASH ONLY</Text>
            </View>

            <View className="flex-row items-end justify-between mb-6">
              <View className="flex-1 pr-4">
                <Text className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Amount Paid (Editable)</Text>
                <View className="flex-row items-center bg-gray-50 dark:bg-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-1">
                  <Text className="text-gray-500 dark:text-gray-400 font-bold mr-2 text-sm">Rs.</Text>
                  <TextInput 
                    className="flex-1 text-right text-lg font-bold text-accent py-2 dark:text-white"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            <Button title="Post Payment" onPress={handleConfirm} />
          </Card>
        ) : (
          <View className="flex-1 items-center justify-center p-8 opacity-50">
            <Text className="text-gray-500 dark:text-gray-400 text-center font-medium">Select a loan account from the table above to proceed with payment entry.</Text>
          </View>
        )}
      </ScrollView>

    </SafeAreaView>
  );
}
