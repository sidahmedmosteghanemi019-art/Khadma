import { Link } from "expo-router";
import { Pressable, Text, TextInput, View } from "react-native";

export default function ForgotPassword() {
  return (
    <View className="flex-1 bg-background px-7 pb-10 pt-6">
      <Link href="/login" asChild>
        <Pressable className="self-start">
          <Text className="text-sm text-primary">{"< "}Back to login</Text>
        </Pressable>
      </Link>

      <Text className="mt-6 text-center text-2xl font-bold">Forgot password?</Text>
      <Text className="mt-2 text-center text-sm text-muted-foreground">
        {"We'll send you a code to reset it."}
      </Text>

      <View className="mt-10 space-y-2">
        <Text className="text-xs font-medium">Enter your email:</Text>
        <TextInput
          keyboardType="email-address"
          autoComplete="email"
          placeholder="Email"
          className="w-full rounded-xl bg-card px-4 py-3.5 text-sm"
        />
      </View>

      <View className="my-6 flex-row items-center gap-3">
        <View className="h-px flex-1 bg-border" />
        <Text className="text-xs text-muted-foreground">OR</Text>
        <View className="h-px flex-1 bg-border" />
      </View>

      <View className="space-y-2">
        <Text className="text-xs font-medium">Enter your phone number:</Text>
        <TextInput
          keyboardType="phone-pad"
          autoComplete="tel"
          placeholder="Phone number"
          className="w-full rounded-xl bg-card px-4 py-3.5 text-sm"
        />
      </View>

      <View className="mt-7">
        <Link href="/confirm-code" asChild>
          <Pressable className="w-full rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">
              Request code
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}