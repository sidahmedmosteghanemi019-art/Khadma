import { Link, useRouter } from "expo-router";
import { Lock, Mail } from "lucide-react-native";
import { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { saveSession } from "@/lib/store";
import { supabase } from "@/lib/supabase";

export default function Login() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Missing details", "Enter your email and password.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (error) {
      Alert.alert("Log in failed", error.message);
      return;
    }
    const user = data.user;
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();
    await saveSession({
      name: profile?.full_name ?? "",
      email: user.email ?? email.trim(),
      phone: profile?.phone ?? "",
      role: profile?.role ?? "client",
      location: profile?.location ?? "",
      specialty: profile?.specialty ?? "",
    });
    router.push("/home");
  };

  return (
    <View
      className="flex-1 bg-background px-7 pb-10"
      style={{ paddingTop: insets.top + 24 }}>
      <Text className="text-2xl font-bold">Welcome back!</Text>
      <Text className="mt-2 text-sm text-muted-foreground">Log in to continue.</Text>

      <View className="mt-7 space-y-3">
        <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
          <Mail size={16} color="#71717A" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoComplete="email"
            placeholder="Email or phone"
            placeholderTextColor="#71717A"
            className="flex-1 bg-transparent text-sm"
          />
        </View>
        <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
          <Lock size={16} color="#71717A" />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
            placeholder="Password"
            placeholderTextColor="#71717A"
            className="flex-1 bg-transparent text-sm"
          />
        </View>
      </View>

      <Link href="/forgot-password" asChild>
        <Pressable className="mt-3 self-end">
          <Text className="text-xs font-medium text-primary">Forgot password?</Text>
        </Pressable>
      </Link>

      <Pressable
        onPress={login}
        disabled={submitting}
        className="mt-7 w-full rounded-xl bg-primary px-6 py-3.5"
      >
        <Text className="text-center text-sm font-semibold text-primary-foreground">
          {submitting ? "Logging in…" : "Log in"}
        </Text>
      </Pressable>

      <View className="mt-5 flex-row justify-center">
        <Text className="text-sm text-muted-foreground">Don't have an account? </Text>
        <Link href="/role" asChild>
          <Pressable>
            <Text className="text-sm font-semibold text-primary">Sign up</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
