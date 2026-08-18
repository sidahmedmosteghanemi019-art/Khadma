import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import { Bell, ChevronRight, Fingerprint, KeyRound, ShieldCheck } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';

type Row = { icon: LucideIcon; label: string; to: Href };

export default function PrivacySecurity() {
  const [biometric, setBiometric] = useState(false);

  const rows: Row[] = [
    { icon: KeyRound, label: 'Change password', to: '/forgot-password' },
    { icon: ShieldCheck, label: 'Two-factor authentication', to: '/profile' },
  ];

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Privacy & security" back="/profile" />
      <View className="flex-1 px-5 pb-8">
        <View className="space-y-2">
          {rows.map(({ icon: Icon, label, to }) => (
            <Link key={label} href={to} asChild>
              <Pressable className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
                <Icon size={16} color="#208AEF" />
                <Text className="flex-1 text-sm font-medium">{label}</Text>
                <ChevronRight size={16} color="#71717A" />
              </Pressable>
            </Link>
          ))}
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Fingerprint size={16} color="#208AEF" />
            <Text className="flex-1 text-sm font-medium">Biometric lock</Text>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ true: '#208AEF', false: '#E4E4E7' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <Link href="/notifications" asChild>
            <Pressable className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
              <Bell size={16} color="#208AEF" />
              <Text className="flex-1 text-sm font-medium">Notification preferences</Text>
              <ChevronRight size={16} color="#71717A" />
            </Pressable>
          </Link>
        </View>
      </View>
    </View>
  );
}
