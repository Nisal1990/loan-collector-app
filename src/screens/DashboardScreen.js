import { format } from 'date-fns';
import { BellRing, CheckCircle2, Target, Users, Wallet } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useContext } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import Card from '../components/Card';
import { AuthContext } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';
import { mockBorrowers } from '../utils/mockData';

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColor = isDark ? '#F1F5F9' : '#020E28';

  // Calculate mock metrics
  const today = new Date();
  const formattedDate = format(today, 'EEEE, dd MMMM yyyy');

  const targetToday = user?.targetToday || 0;
  const assignedLoans = user?.assignedLoans || 0;

  const pendingBorrowers = mockBorrowers.filter(b => !b.paidToday);
  const paidBorrowers = mockBorrowers.filter(b => b.paidToday);

  const collectedToday = paidBorrowers.reduce((acc, curr) => acc + (curr.amountPaid || 0), 0);
  const pendingCount = pendingBorrowers.length;

  const progressPerc = Math.min((collectedToday / targetToday) * 100, 100) || 0;

  // Recent activity
  const recentPayments = paidBorrowers.map(b => ({
    id: b.payments?.[b.payments.length - 1]?.id || Math.random().toString(),
    name: b.fullName,
    amount: b.payments?.[b.payments.length - 1]?.amount || 0,
    time: "10:45 AM"
  }));

  return (
    <SafeAreaView className="flex-1 bg-background dark:bg-slate-900">
      <ScrollView className="flex-1 px-4 pt-6 pb-20">

        {/* Header */}
        <View className="mb-6">
          <Text className="text-slate-500 dark:text-slate-400 font-semibold mb-1">{formattedDate}</Text>
          <Text className="text-2xl font-bold text-dark dark:text-white">Good Morning, {user?.name?.split(' ')[0]}</Text>
        </View>

        {/* Collection Progress — White card in light, dark card in dark mode */}
        <Card className="mb-6" noPadding={true}>
          <View className="p-5">
            <View className="flex-row justify-between items-end mb-3">
              <View>
                <Text className="text-slate-500 dark:text-slate-400 font-medium mb-1">Today's Progress</Text>
                <Text className="text-3xl font-bold text-dark dark:text-white">{formatCurrency(collectedToday)}</Text>
              </View>
              <Text className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">{progressPerc.toFixed(0)}%</Text>
            </View>

            <View className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <View
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                style={{ width: `${progressPerc}%` }}
              />
            </View>
            <Text className="text-slate-400 dark:text-slate-500 text-xs mt-2 text-right">Target: {formatCurrency(targetToday)}</Text>
          </View>
        </Card>

        {/* Metric Cards Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <Card className="w-[48%] mb-4 py-4 px-3">
            <View className="w-10 h-10 rounded-full bg-primary-50 dark:bg-red-900/30 items-center justify-center mb-3">
              <Users color={isDark ? "#FCA5A5" : "#FF131D"} size={20} />
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Assigned Loans</Text>
            <Text className="text-lg font-bold text-dark dark:text-white">{assignedLoans}</Text>
          </Card>

          <Card className="w-[48%] mb-4 py-4 px-3">
            <View className="w-10 h-10 rounded-full bg-amber-50 dark:bg-amber-900/30 items-center justify-center mb-3">
              <Target color={isDark ? "#FCD34D" : "#F59E0B"} size={20} />
            </View>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold mb-1">Pending Today</Text>
            <Text className="text-lg font-bold text-dark dark:text-white">{pendingCount} Borrowers</Text>
          </Card>
        </View>

        {/* Quick Actions */}
        <Text className="text-lg font-bold text-dark dark:text-white mb-3">Quick Actions</Text>
        <View className="flex-row justify-between mb-8">
          <Button
            title="Start Round"
            icon={<Wallet color="white" size={18} />}
            onPress={() => navigation.navigate('Collections')}
            className="flex-1 mr-2"
          />
          <Button
            title="Remind All"
            variant="outline"
            icon={<BellRing color={iconColor} size={18} />}
            onPress={() => navigation.navigate('Messages')}
            className="flex-1 ml-2"
          />
        </View>

        {/* Recent Activity */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-lg font-bold text-dark dark:text-white">Recent Activity</Text>
        </View>

        <Card noPadding={true} className="mb-8">
          {recentPayments.length > 0 ? (
            recentPayments.map((payment, index) => (
              <View
                key={payment.id}
                className={`flex-row items-center p-4 ${index !== recentPayments.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
              >
                <View className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 rounded-full items-center justify-center mr-3">
                  <CheckCircle2 color={isDark ? "#34D399" : "#10B981"} size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-dark dark:text-white font-bold">{payment.name}</Text>
                  <Text className="text-slate-400 dark:text-slate-500 text-xs">{payment.time} • Cash Payment</Text>
                </View>
                <Text className="text-emerald-600 dark:text-emerald-400 font-bold">+{formatCurrency(payment.amount)}</Text>
              </View>
            ))
          ) : (
            <View className="p-6 items-center">
              <Text className="text-slate-400 dark:text-slate-500">No collections made yet today.</Text>
            </View>
          )}
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
}
