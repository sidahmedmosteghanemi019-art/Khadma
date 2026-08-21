import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  CreditCard,
  LifeBuoy,
  Lock,
  MapPin,
  UserRound,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { IconCircle } from '@/components/handyhub/icon-circle';
import { ScreenHeader } from '@/components/handyhub/screen-header';
import { showAlert } from '@/lib/alert';
import { clearSession } from '@/lib/store';
import { supabase } from '@/lib/supabase';

type Row = {
  icon: LucideIcon;
  label: string;
  hint?: string;
  to?: Href;
};

const groups: { title: string; rows: Row[] }[] = [
  {
    title: 'Account',
    rows: [
      {
        icon: UserRound,
        label: 'Personal information',
        hint: 'Name, email and phone',
        to: '/profile/personal-information',
      },
      {
        icon: MapPin,
        label: 'Saved addresses',
        hint: 'Where you need work done',
        to: '/profile/saved-addresses',
      },
    ],
  },
  {
    title: 'Preferences',
    rows: [
      {
        icon: Bell,
        label: 'Notifications',
        hint: 'Alerts about your jobs',
        to: '/notifications',
      },
      {
        icon: Lock,
        label: 'Privacy & security',
        hint: 'Password and permissions',
        to: '/profile/privacy-security',
      },
      {
        icon: CreditCard,
        label: 'Payment methods',
        hint: 'Cards and payouts',
        to: '/payment-methods',
      },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();

  const renderRow = ({ icon: Icon, label, hint, to }: Row) => (
    <Pressable
      key={label}
      onPress={() => {
        if (to) router.push(to);
        else showAlert(label, 'This will be available soon.');
      }}
      className="flex-row items-center gap-3 rounded-2xl bg-card px-4 py-3.5">
      <IconCircle icon={Icon} />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
        {hint ? <Text className="mt-0.5 text-xs text-muted-foreground">{hint}</Text> : null}
      </View>
      <ChevronRight size={16} color="#5F6B62" />
    </Pressable>
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Settings" back="/profile" />
      <ScrollView className="flex-1 px-5 pb-10" contentContainerStyle={{ rowGap: 12 }}>
        <Text className="px-1 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </Text>
        <View className="gap-3">{groups[0]!.rows.map(renderRow)}</View>
        <Text className="px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Preferences
        </Text>
        <View className="gap-3">{groups[1]!.rows.map(renderRow)}</View>
        <Text className="px-1 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Support
        </Text>
        <View className="gap-3">
          {renderRow({
            icon: LifeBuoy,
            label: 'Help & support',
            hint: 'FAQs and contact us',
          })}
        </View>
        <Pressable
          onPress={async () => {
            await supabase.auth.signOut();
            await clearSession();
            router.push('/login');
          }}
          className="mt-6 w-full rounded-xl bg-brand-orange px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-white">Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
