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
      className="flex-1 bg-primary justify-center px-6"
    >
      <View className="items-center mb-10">
        <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4">
          <Image
            source={require('../../assets/images/logo.png')}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        <Text className="text-3xl font-bold text-white mb-2">Kijen Global</Text>
        <Text className="text-gray-300 text-center">
          Microfinance Field Operations
        </Text>
      </View>

      <Card className="p-6">
        <Text className="text-xl font-bold text-primary mb-6 text-center">
          Collector Login
        </Text>

        {error ? (
          <Text className="text-danger text-center mb-4">{error}</Text>
        ) : null}

        <View className="mb-4">
          <Text className="text-gray-600 font-semibold mb-2">Employee ID</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <UserRound color="#94A3B8" size={20} />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-800"
              placeholder="e.g. E-1045"
              autoCapitalize="none"
              value={employeeId}
              onChangeText={setEmployeeId}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 font-semibold mb-2">Password</Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <KeyRound color="#94A3B8" size={20} />
            <TextInput
              className="flex-1 ml-3 text-base text-gray-800"
              placeholder="••••••••"
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
        />
      </Card>

      <Text className="text-gray-400 text-center mt-10 text-sm">
        Kijen Global @2026. All Rights Reserved. Developed By – Team Lily
      </Text>
    </KeyboardAvoidingView>
  );
}