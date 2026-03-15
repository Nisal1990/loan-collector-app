import React, { useState, useContext } from 'react';
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, Modal, TextInput, ScrollView, Alert } from 'react-native';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { useColorScheme } from 'nativewind';
import { mockBorrowers } from '../utils/mockData';
import { formatCurrency } from '../utils/currency';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { X } from 'lucide-react-native';

export default function CollectionsScreen() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('Pending');
  
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#F1F5F9' : '#1E2A4A';
  
  // Use mock data for borrowers, but in a real app this would be local state/context updated after payment
  const [borrowers, setBorrowers] = useState(mockBorrowers);
  
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [penaltyInput, setPenaltyInput] = useState('0');

  const todayDate = format(new Date(), 'EEEE, dd MMMM yyyy');
  const targetToday = user?.targetToday || 0;

  const tabs = ['Pending', 'Paid', 'All'];

  const filteredData = borrowers.filter(b => {
    if (activeTab === 'Pending') return !b.paidToday;
    if (activeTab === 'Paid') return b.paidToday;
    return true;
  });

  const openPaymentModal = (borrower) => {
    setSelectedBorrower(borrower);
    // Determine default penalty from outstanding penalties if any
    const defaultPenalty = borrower.penaltyOutstanding || 0;
    setPenaltyInput(defaultPenalty.toString());
    setModalVisible(true);
  };

  const confirmPayment = () => {
    if (!selectedBorrower) return;
    const penaltyAmt = parseFloat(penaltyInput) || 0;
    const totalCollected = selectedBorrower.dailyDue + penaltyAmt;
    
    // Simulate updating state
    const updatedBorrowers = borrowers.map(b => {
      if (b.id === selectedBorrower.id) {
        return {
          ...b,
          paidToday: true,
          amountPaid: b.amountPaid + totalCollected,
          outstanding: Math.max(0, b.outstanding - selectedBorrower.dailyDue),
          payments: [
            ...b.payments,
            { id: `PAY-${Date.now()}`, date: format(new Date(), 'yyyy-MM-dd'), amount: totalCollected, capital: b.capitalDue, interest: b.interestDue }
          ]
        };
      }
      return b;
    });

    setBorrowers(updatedBorrowers);
    setModalVisible(false);
    setSelectedBorrower(null);
    Alert.alert("Success", "Payment confirmed and receipt generated successfully.");
  };

  const CollectionCard = ({ item }) => {
    if (item.paidToday) {
      // Paid Card
      const latestPayment = item.payments[item.payments.length - 1];
      const receiptNo = `RCPT-${format(new Date(), 'yyyyMMdd')}-${item.id.split('-')[1]}`;
      
      return (
        <Card className="mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text className="text-base font-bold text-primary dark:text-white">{item.fullName}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">Receipt: {receiptNo}</Text>
            </View>
            <Badge label="Paid" status="success" />
          </View>
          <View className="flex-row justify-between bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg border border-gray-100 dark:border-slate-700">
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Time</Text>
              <Text className="font-semibold text-primary dark:text-white">10:45 AM</Text>
            </View>
            <View className="border-r border-gray-200 dark:border-slate-600" />
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Capital / Int</Text>
              <Text className="font-semibold text-primary dark:text-white">{item.capitalDue} / {item.interestDue}</Text>
            </View>
            <View className="border-r border-gray-200 dark:border-slate-600" />
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs text-center mb-1">Collected</Text>
              <Text className="font-bold text-accent">+{formatCurrency(latestPayment?.amount || item.dailyDue)}</Text>
            </View>
          </View>
        </Card>
      );
    } else {
      // Pending Card
      const penalty = item.penaltyOutstanding || 0;
      const totalToCollect = item.dailyDue + penalty;
      
      return (
        <Card className="mb-4">
          <View className="flex-row items-center mb-3">
            {item.photoUrl ? (
              <Image source={{ uri: item.photoUrl }} className="w-12 h-12 rounded-full mr-3" />
            ) : (
              <View className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 items-center justify-center mr-3">
                <Text className="text-primary dark:text-blue-100 font-bold">{item.initials}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text className="text-base font-bold text-primary dark:text-white">{item.fullName}</Text>
              <Text className="text-gray-500 dark:text-gray-400 text-xs">A/C: {item.loanAccountNo}</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between mt-2 pt-3 border-t border-gray-100 dark:border-slate-700 mb-4">
            <View>
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Due Today</Text>
              <Text className="font-semibold text-primary dark:text-white">{formatCurrency(item.dailyDue)}</Text>
            </View>
            {penalty > 0 && (
              <View>
                <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Penalty</Text>
                <Text className="font-semibold text-danger">{formatCurrency(penalty)}</Text>
              </View>
            )}
            <View className="items-end">
              <Text className="text-gray-500 dark:text-gray-400 text-xs mb-1">Total</Text>
              <Text className="font-bold text-primary dark:text-white">{formatCurrency(totalToCollect)}</Text>
            </View>
          </View>
          
          <Button 
            title="Mark as Paid" 
            onPress={() => openPaymentModal(item)}
            className="w-full"
          />
        </Card>
      );
    }
  };

  const renderCard = ({ item }) => <CollectionCard item={item} />;

  const b = selectedBorrower || {};

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <View className="px-4 py-4 bg-primary dark:bg-slate-800 rounded-b-3xl">
        <Text className="text-blue-100 font-semibold mb-1">{todayDate}</Text>
        <Text className="text-2xl font-bold text-white mb-2">Today's Collections</Text>
        <Text className="text-blue-200 font-medium">Target: {formatCurrency(targetToday)}</Text>
      </View>
      
      <View className="px-4 pt-4">
        {/* Tabs */}
        <View className="flex-row bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl p-1 shadow-sm mb-4">
          {tabs.map(tab => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                className={`flex-1 py-2 items-center rounded-lg ${isActive ? 'bg-primary dark:bg-slate-600' : 'bg-transparent'}`}
              >
                <Text className={`font-semibold ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>{tab}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={{ padding: 16, paddingBottom: 150, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center p-10 mt-10">
            <Text className="text-gray-400 dark:text-gray-500 text-center">No borrowers in this category.</Text>
          </View>
        }
      />

      {/* Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50 dark:bg-black/70">
          <View className="bg-white dark:bg-slate-800 rounded-t-3xl p-6 h-auto max-h-[90%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-primary dark:text-white">Confirm Recovery</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full">
                <X color={iconColor} size={20} />
              </TouchableOpacity>
            </View>

            {selectedBorrower && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="bg-blue-50 dark:bg-slate-700/50 p-4 rounded-xl border border-blue-100 dark:border-slate-600 mb-6">
                  <Text className="font-bold text-primary dark:text-white mb-1">{b.fullName}</Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2">A/C: {b.loanAccountNo}</Text>
                  <View className="flex-row justify-between border-t border-blue-200 dark:border-slate-600 mt-2 pt-2">
                    <Text className="text-primary dark:text-gray-300 font-semibold">Payment Type</Text>
                    <Text className="text-primary dark:text-white font-bold">CASH ONLY</Text>
                  </View>
                </View>

                {/* Amount Details */}
                <View className="mb-4 flex-row justify-between items-center">
                  <Text className="text-gray-600 dark:text-gray-300 font-semibold mb-1">Installment Amount</Text>
                  <Text className="text-lg font-bold text-primary dark:text-white">{formatCurrency(b.dailyDue || 0)}</Text>
                </View>

                <View className="mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                  <Text className="text-gray-600 dark:text-gray-300 font-semibold mb-2">Penalty Amount (Editable)</Text>
                  <View className="flex-row items-center bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-1">
                    <Text className="text-gray-500 dark:text-gray-400 font-bold mr-2">Rs.</Text>
                    <TextInput 
                      className="flex-1 text-right text-lg font-medium text-danger py-2"
                      value={penaltyInput}
                      onChangeText={setPenaltyInput}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                {/* Calculation Summary */}
                <View className="bg-gray-50 dark:bg-slate-700/30 p-4 rounded-xl border border-gray-200 dark:border-slate-700 mb-6">
                  <View className="flex-row justify-between mb-2">
                    <Text className="text-gray-500 dark:text-gray-400">Capital Recovered</Text>
                    <Text className="text-primary dark:text-gray-200 font-medium">{formatCurrency(b.capitalDue || 0)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-2 border-b border-gray-200 dark:border-slate-700 pb-2">
                    <Text className="text-gray-500 dark:text-gray-400">Interest Recovered</Text>
                    <Text className="text-primary dark:text-gray-200 font-medium">{formatCurrency(b.interestDue || 0)}</Text>
                  </View>
                  <View className="flex-row justify-between mt-2 items-center">
                    <Text className="text-primary dark:text-white font-bold text-lg">Total Amount</Text>
                    <Text className="text-accent font-bold text-2xl">
                      {formatCurrency((b.dailyDue || 0) + (parseFloat(penaltyInput) || 0))}
                    </Text>
                  </View>
                </View>

                <Button 
                  title="Confirm Cash Payment" 
                  onPress={confirmPayment}
                  className="w-full mb-6 py-4"
                  textClassName="text-lg"
                />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
