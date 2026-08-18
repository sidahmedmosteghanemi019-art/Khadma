import { Link } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';

export default function ConfirmCode() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/forgot-password" />
      <View className="flex-1 px-7">
        <Text className="text-center text-2xl font-bold">Confirm code</Text>
        <Text className="mt-2 text-center text-sm text-muted-foreground">
          We sent a 6-digit code to your inbox.
        </Text>
        <View className="mt-10 space-y-2">
          <Text className="text-xs font-medium">Enter your code:</Text>
          <TextInput
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#71717A"
            className="w-full rounded-xl bg-card px-4 py-3.5 text-center text-lg tracking-[8]"
          />
        </View>
        <Text className="mt-4 text-xs text-muted-foreground">
          Didn&apos;t get it?{' '}
          <Text className="font-semibold text-primary" onPress={() => {}}>
            Resend code
          </Text>
        </Text>
      </View>
      <View className="px-7 pb-10">
        <Link href="/reset-password" asChild>
          <Pressable className="w-full rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">
              Verify code
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
