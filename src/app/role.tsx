import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { cn } from '@/lib/utils';

const roles = [
  { key: 'client', emoji: '🙋🏽‍♀️', title: 'I need a service', body: 'Find trusted help nearby, when you need it.' },
  { key: 'worker', emoji: '👷🏾‍♂️', title: 'I offer services', body: 'Get hired for work close to home.' },
] as const;

export default function RolePicker() {
  const router = useRouter();
  const [role, setRole] = useState<string>('client');
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/onboarding" />
      <View className="flex-1 px-7">
        <Text className="text-2xl font-bold">Choose your role</Text>
        <Text className="mt-2 text-sm text-muted-foreground">Select how you want to use HandyHub.</Text>
        <View className="mt-8 space-y-4">
          {roles.map((r) => (
            <Pressable
              key={r.key}
              onPress={() => setRole(r.key)}
              className={cn(
                'flex w-full flex-row items-center gap-4 rounded-2xl border-2 bg-card p-4',
                role === r.key ? 'border-primary' : 'border-transparent',
              )}>
              <View className="h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-accent/60">
                <Text className="text-2xl">{r.emoji}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold">{r.title}</Text>
                <Text className="text-xs text-muted-foreground">{r.body}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
      <View className="px-7 pb-10">
        <Pressable
          onPress={() => router.push(`/signup?role=${role}`)}
          className="w-full rounded-xl bg-primary px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-primary-foreground">Next</Text>
        </Pressable>
      </View>
    </View>
  );
}
