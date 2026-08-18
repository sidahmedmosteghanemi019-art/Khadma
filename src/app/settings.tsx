import { Link, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CreditCard,
  Globe,
  HelpCircle,
  ShieldCheck,
  UserRound,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { clearSession } from '@/lib/store';
import { supabase } from '@/lib/supabase';

const rows: { icon: LucideIcon; label: string; to: Href }[] = [
  { icon: UserRound, label: 'Account', to: '/profile' },
  { icon: ShieldCheck, label: 'Privacy & security', to: '/profile' },
  { icon: Bell, label: 'Notifications', to: '/notifications' },
  { icon: CreditCard, label: 'Payment methods', to: '/payment-methods' },
  { icon: Globe, label: 'Language', to: '/profile' },
  { icon: HelpCircle, label: 'Help & support', to: '/profile' },
];

export default function SettingsScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-brand-deep">
      <ScreenHeader title="Settings" back="/profile" onDark />
      <ScrollView className="flex-1 space-y-2 px-5 pb-8">
        {rows.map(({ icon: Icon, label, to }) => (
          <Link href={to} key={label} asChild>
            <Pressable className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
              <Icon size={16} color="#208AEF" />
              <Text className="flex-1 text-sm font-medium">{label}</Text>
              <ChevronRight size={16} color="#71717A" />
            </Pressable>
          </Link>
        ))}
        <Pressable
          onPress={async () => {
            await supabase.auth.signOut();
            await clearSession();
            router.push('/login');
          }}
          className="mt-6 w-full rounded-xl bg-brand-lime px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-brand-deep">Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
