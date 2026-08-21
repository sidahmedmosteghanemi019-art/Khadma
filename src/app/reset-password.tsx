import { Link } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';

export default function ResetPassword() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/confirm-code" />
      <View className="flex-1 px-7">
        <Text className="text-center text-2xl font-bold">Reset password</Text>
        <View className="mt-10 space-y-4">
          <View className="space-y-2">
            <Text className="text-xs font-medium">Enter new password</Text>
            <TextInput
              secureTextEntry
              autoComplete="new-password"
              placeholder="New password"
              placeholderTextColor="#5F6B62"
              className="w-full rounded-xl bg-card px-4 py-3.5 text-sm"
            />
          </View>
          <View className="space-y-2">
            <Text className="text-xs font-medium">Confirm new password</Text>
            <TextInput
              secureTextEntry
              autoComplete="new-password"
              placeholder="Confirm new password"
              placeholderTextColor="#5F6B62"
              className="w-full rounded-xl bg-card px-4 py-3.5 text-sm"
            />
          </View>
        </View>
      </View>
      <View className="px-7 pb-10">
        <Link href="/login" asChild>
          <Pressable className="w-full rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">Done</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
