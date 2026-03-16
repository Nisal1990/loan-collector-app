import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, ChevronUp, MessageCircle, MessageSquare, Wallet } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { mockBorrowers } from '../utils/mockData';
import { formatCurrency } from '../utils/currency';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

// Reusable Accordion Section Component
const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Card className="mb-4" noPadding={true}>
      <TouchableOpacity 
        className="flex-row justify-between items-center p-4"
        onPress={() => setIsOpen(!isOpen)}
        activeOpacity={0.7}
      >
        <Text className="font-bold text-dark dark:text-white text-base">{title}</Text>
        {isOpen ? <ChevronUp color="#94A3B8" size={20} /> : <ChevronDown color="#94A3B8" size={20} />}
      </TouchableOpacity>
      {isOpen && (
        <View className="px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-700">
          {children}
        </View>
      )}
    </Card>
  );
};

// Data Row helper component
const DataRow = ({ label, value, isBold = false, isDanger = false, isSuccess = false }) => (
  <View className="flex-row justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
    <Text className="text-slate-500 dark:text-slate-400 w-[40%]">{label}</Text>
    <Text className={`w-[60%] text-right ${isBold ? 'font-bold' : ''} ${isDanger ? 'text-red-600 dark:text-red-400' : ''} ${isSuccess ? 'text-emerald-600 dark:text-emerald-400' : 'text-dark dark:text-white'}`}>
      {value || '-'}
    </Text>
  </View>
);

export default function BorrowerProfileScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#F1F5F9' : '#020E28';

  const borrowerId = route.params?.borrowerId || mockBorrowers[0].id;
  const borrower = mockBorrowers.find(b => b.id === borrowerId) || mockBorrowers[0];

  const handleWhatsApp = () => {
    const msg = `Dear ${borrower.fullName}, your loan installment of ${formatCurrency(borrower.dailyDue)} for account ${borrower.loanAccountNo} is due today. Please contact your loan officer. Thank you.`;
    Linking.openURL(`whatsapp://send?phone=${borrower.mobile1}&text=${encodeURIComponent(msg)}`).catch(() => {
      alert("Make sure WhatsApp is installed on your device");
    });
  };

  const handleSMS = () => {
    const msg = `Dear ${borrower.fullName}, your loan installment of ${formatCurrency(borrower.dailyDue)} for account ${borrower.loanAccountNo} is due today.`;
    Linking.openURL(`sms:${borrower.mobile1}?body=${encodeURIComponent(msg)}`).catch(() => {
      alert("Failed to open SMS app");
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
          <ChevronLeft color={iconColor} size={24} />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-bold text-dark dark:text-white mr-6">Profile Details</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4 pb-24" showsVerticalScrollIndicator={false}>
        
        {/* Top summary card */}
        <View className="items-center mb-6 mt-2">
          {borrower.photoUrl ? (
            <Image source={{ uri: borrower.photoUrl }} className="w-24 h-24 rounded-full mb-3 border-4 border-white dark:border-slate-800 shadow-sm" />
          ) : (
            <View className="w-24 h-24 rounded-full bg-primary-50 dark:bg-red-900/30 items-center justify-center mb-3">
              <Text className="text-xl font-bold text-primary dark:text-red-300">{borrower.initials}</Text>
            </View>
          )}
          <Text className="text-xl font-bold text-dark dark:text-white">{borrower.fullName}</Text>
          <Text className="text-slate-500 dark:text-slate-400 mb-2">A/C: {borrower.loanAccountNo}</Text>
          <Badge 
            label={borrower.status} 
            status={borrower.status === 'Completed' ? 'success' : borrower.status === 'Active' ? 'warning' : 'danger'} 
          />
        </View>

        {/* Section A: Personal Details */}
        <AccordionSection title="Section A - Personal Details" defaultOpen={true}>
          <DataRow label="CIF Number" value={borrower.cif} isBold />
          <DataRow label="NIC Number" value={borrower.nic} />
          <DataRow label="Full Name" value={borrower.fullName} />
          <DataRow label="Salutation" value={borrower.salutation} />
          <DataRow label="Date of Birth" value={borrower.dob} />
          <DataRow label="Age" value={`${borrower.age} Years`} />
          <DataRow label="Gender" value={borrower.gender} />
          <DataRow label="Grama Seva Div" value={borrower.gramaSeva} />
        </AccordionSection>

        {/* Section B: Contact Details */}
        <AccordionSection title="Section B - Contact Details">
          <DataRow label="Fixed Address" value={borrower.addressFixed} />
          <DataRow label="Postal Address" value={borrower.addressPostal} />
          <DataRow label="Mobile #1" value={borrower.mobile1} isBold />
          <DataRow label="Mobile #2" value={borrower.mobile2} />
          <DataRow label="Fixed Telephone" value={borrower.telephone} />
          <DataRow label="Email" value={borrower.email} />
        </AccordionSection>

        {/* Section C: Job Details */}
        <AccordionSection title="Section C - Job Details">
          <DataRow label="Employee No" value={borrower.employeeNo} />
          <DataRow label="Job Type" value={borrower.jobType} />
          <DataRow label="Employer Name" value={borrower.employerName} isBold />
          <DataRow label="Employer Addr" value={borrower.employerAddress} />
          <DataRow label="Telephone" value={borrower.employerPhone} />
          <DataRow label="Base Salary" value={formatCurrency(borrower.baseSalary)} />
          <DataRow label="Fixed Allowance" value={formatCurrency(borrower.fixedAllowance)} />
          <DataRow label="Total Salary" value={formatCurrency(borrower.baseSalary + (borrower.fixedAllowance || 0))} isBold />
        </AccordionSection>

        {/* Section D: Loan Details */}
        <AccordionSection title="Section D - Loan Details" defaultOpen={true}>
          <DataRow label="Loan Account No" value={borrower.loanAccountNo} isBold />
          <DataRow label="Application No" value={borrower.applicationNo} />
          <DataRow label="Loan Amount" value={formatCurrency(borrower.loanAmount)} isBold />
          <DataRow label="Days/Installments" value={`${borrower.days} Days`} />
          <DataRow label="Daily Due" value={formatCurrency(borrower.dailyDue)} isBold />
          <DataRow label="Capital Due" value={formatCurrency(borrower.capitalDue)} />
          <DataRow label="Interest Due" value={formatCurrency(borrower.interestDue)} />
          <DataRow label="Interest %" value={borrower.interestRate} />
          <DataRow label="Issued Date" value={borrower.issuedDate} />
          <DataRow label="End Date" value={borrower.endDate} />
          <DataRow label="Total Receivable" value={formatCurrency(borrower.totalReceivable)} isBold />
          <DataRow label="Settlement Amt" value={formatCurrency(borrower.settlementAmount)} />
        </AccordionSection>

        {/* Section E: Payment History */}
        <AccordionSection title="Section E - Payment History">
          <View className="mb-4 mt-2">
            <View className="flex-row border-b-2 border-slate-200 dark:border-slate-700 pb-2 mb-2">
              <Text className="flex-[2] font-bold text-slate-600 dark:text-slate-300 text-xs">Date</Text>
              <Text className="flex-[2] font-bold text-slate-600 dark:text-slate-300 text-xs text-right">Pay Amt</Text>
              <Text className="flex-[2] font-bold text-slate-600 dark:text-slate-300 text-xs text-right">Capital</Text>
              <Text className="flex-[2] font-bold text-slate-600 dark:text-slate-300 text-xs text-right">Interest</Text>
            </View>
            
            {borrower.payments.length > 0 ? (
              borrower.payments.map((pay) => (
                <View key={pay.id} className="flex-row border-b border-slate-100 dark:border-slate-700/50 py-2">
                  <Text className="flex-[2] text-xs text-dark dark:text-white">{pay.date}</Text>
                  <Text className="flex-[2] text-xs text-dark dark:text-white font-semibold text-right">{pay.amount}</Text>
                  <Text className="flex-[2] text-xs text-slate-500 dark:text-slate-400 text-right">{pay.capital}</Text>
                  <Text className="flex-[2] text-xs text-slate-500 dark:text-slate-400 text-right">{pay.interest}</Text>
                </View>
              ))
            ) : (
              <Text className="text-slate-400 dark:text-slate-500 text-center py-4 text-sm">No payments recorded</Text>
            )}
          </View>
          
          <View className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 mt-2">
            <Text className="font-bold text-dark dark:text-white mb-2 border-b border-slate-200 dark:border-slate-600 pb-2">Summary</Text>
            <DataRow label="Rental Paid" value={borrower.rentalsPaid} />
            <DataRow label="Rental Due" value={Math.max(0, borrower.days - borrower.rentalsPaid)} />
            <DataRow label="Due Amount" value={formatCurrency(borrower.outstanding)} isDanger={borrower.outstanding > 0} />
            <DataRow label="Amount Paid" value={formatCurrency(borrower.amountPaid)} isSuccess={borrower.amountPaid >= borrower.totalReceivable} />
            <DataRow label="Capital Covered" value={formatCurrency(borrower.capitalCovered)} />
            <DataRow label="Interest Covered" value={formatCurrency(borrower.interestCovered)} />
            
            <View className="flex-row justify-between py-2 border-b border-slate-50 dark:border-slate-700/50">
              <Text className="text-slate-500 dark:text-slate-400 w-[40%]">Arrears/Over Pay</Text>
              <View className="w-[60%] items-end">
                {borrower.status === 'Completed' || borrower.outstanding === 0 ? (
                  <Badge label="Loan Paid" status="success" />
                ) : (
                  <Text className="text-red-600 dark:text-red-400 font-bold">{formatCurrency(borrower.arrearsAmount)}</Text>
                )}
              </View>
            </View>
            <DataRow label="Arrears Rentals" value={borrower.arrearsRentals} isDanger={borrower.arrearsRentals > 0} />
          </View>
        </AccordionSection>

        {/* Section F: Penalty Payments */}
        <AccordionSection title="Section F - Penalty Payments">
          {borrower.penalties && borrower.penalties.length > 0 ? (
            <View>
              {borrower.penalties.map(pen => (
                <View key={pen.id} className="flex-row justify-between items-center py-2 border-b border-slate-100 dark:border-slate-700/50">
                  <View>
                    <Text className="text-dark dark:text-white font-bold">{pen.date}</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-xs">{pen.reason}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-red-600 dark:text-red-400 font-bold">{formatCurrency(pen.amount)}</Text>
                    <Text className={`text-xs ${pen.status === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>{pen.status}</Text>
                  </View>
                </View>
              ))}
              <View className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 flex-row justify-between">
                <Text className="font-bold text-slate-700 dark:text-slate-300">Total Penalties</Text>
                <Text className="font-bold text-red-600 dark:text-red-400">{formatCurrency(borrower.penaltyOutstanding)}</Text>
              </View>
            </View>
          ) : (
            <Text className="text-slate-400 dark:text-slate-500 py-3">No penalties applied to this account.</Text>
          )}
        </AccordionSection>

        <View className="h-10" />

      </ScrollView>

      {/* Floating Action Buttons */}
      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 pb-6 flex-row justify-between">
        <Button 
          title="Collect" 
          icon={<Wallet color="white" size={18} />}
          onPress={() => navigation.navigate('Collections')}
          className="flex-1 mr-2"
        />
        <TouchableOpacity 
          onPress={handleWhatsApp}
          className="w-14 h-14 border-2 border-slate-200 dark:border-slate-600 rounded-xl items-center justify-center bg-white dark:bg-slate-800 active:opacity-80"
        >
          <MessageCircle color={isDark ? "#94A3B8" : "#64748B"} size={24} />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={handleSMS}
          className="w-14 h-14 border-2 border-slate-200 dark:border-slate-600 rounded-xl items-center justify-center bg-white dark:bg-slate-800 ml-2 active:opacity-80"
        >
          <MessageSquare color={isDark ? "#94A3B8" : "#64748B"} size={24} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
