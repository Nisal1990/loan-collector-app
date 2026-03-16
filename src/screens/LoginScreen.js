import { KeyRound, UserRound } from 'lucide-react-native';
import { useContext, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Text, TextInput, View } from 'react-native';
import Button from '../components/Button';
import Card from '../components/Card';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const { login } = useContext(AuthContext);
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!employeeId || !password) {
      setError('Please enter Employee ID and Password');
      return;
    }

    setLoading(true);
    setError('');

    const success = await login(employeeId, password);

    if (!success) {
      setError('Invalid credentials');
    }

    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-dark justify-center px-6"
    >
      <View className="items-center mb-10">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-white mb-2">Kijen Global</Text>
        <Text className="text-slate-400 text-center">
          Microfinance Field Operations
        </Text>
      </View>

      <Card className="p-6">
        <Text className="text-xl font-bold text-dark dark:text-white mb-6 text-center">
          Collector Login
        </Text>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <Text className="text-red-600 dark:text-red-400 text-center text-sm font-medium">{error}</Text>
          </View>
        ) : null}

        <View className="mb-4">
          <Text className="text-slate-600 dark:text-slate-400 font-semibold mb-2">Employee ID</Text>
          <View className="flex-row items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3">
            <UserRound color="#94A3B8" size={20} />
            <TextInput
              className="flex-1 ml-3 text-base text-slate-800 dark:text-white"
              placeholder="e.g. E-1045"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              value={employeeId}
              onChangeText={setEmployeeId}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-slate-600 dark:text-slate-400 font-semibold mb-2">Password</Text>
          <View className="flex-row items-center bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl px-4 py-3">
            <KeyRound color="#94A3B8" size={20} />
            <TextInput
              className="flex-1 ml-3 text-base text-slate-800 dark:text-white"
              placeholder="••••••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          className="w-full"
          size="lg"
        />
      </Card>

      <Text className="text-slate-500 text-center mt-10 text-sm">
        Kijen Global @2026. All Rights Reserved. Developed By – Team Lily
      </Text>
    </KeyboardAvoidingView>
  );
}