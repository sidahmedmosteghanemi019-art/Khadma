import { Link } from 'expo-router';
import type { Href } from 'expo-router';
import {
  ChevronRight,
  CreditCard,
  MapPin,
  Settings,
  ShieldCheck,
  UserRound,
  Wrench,
} from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories, jobs } from '@/lib/handyhub-data';
import type { UserRole } from '@/lib/store';
import { getSession } from '@/lib/store';

const rows: { icon: LucideIcon; label: string; to: Href }[] = [
  { icon: UserRound, label: 'Personal information', to: '/profile/personal-information' },
  { icon: CreditCard, label: 'Payment methods', to: '/payment-methods' },
  { icon: MapPin, label: 'Saved addresses', to: '/profile/saved-addresses' },
  { icon: ShieldCheck, label: 'Privacy & security', to: '/profile/privacy-security' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    getSession().then((s) => {
      if (!s) return;
      setName(s.name);
      setEmail(s.email);
      setRole(s.role);
      setSpecialty(s.specialty);
    });
  }, []);

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'HH';
  const displayName = name || 'HandyHub member';
  const specialtyName = specialty
    ? categories.find((c) => c.slug === specialty)?.name ?? specialty
    : '';
  const workerJobs = role === 'worker' ? jobs.filter((j) => j.category === specialty).length : 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="My profile" back="/home" />
      <View className="flex-1 px-5 pb-6">
        <View className="flex-row items-center gap-4 rounded-2xl bg-card p-4">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-accent/70">
            <Text className="text-base font-bold text-primary">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold">{displayName}</Text>
            <Text className="text-xs text-muted-foreground">
              {role === 'worker'
                ? `${specialtyName || 'Worker'} · ${email || 'Member'}`
                : email || 'Member since 2024'}
            </Text>
          </View>
        </View>

        {role === 'worker' ? (
          <View className="mt-4 flex-row gap-3">
            <View className="flex-1 rounded-2xl bg-card p-4">
              <Text className="text-xl font-bold">4.8</Text>
              <Text className="mt-1 text-[11px] text-muted-foreground">Rating</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-card p-4">
              <Text className="text-xl font-bold">{workerJobs}</Text>
              <Text className="mt-1 text-[11px] text-muted-foreground">Jobs</Text>
            </View>
            <View className="flex-1 rounded-2xl bg-card p-4">
              <Text className="text-xl font-bold">R600</Text>
              <Text className="mt-1 text-[11px] text-muted-foreground">Earned</Text>
            </View>
          </View>
        ) : null}

        {role === 'worker' && specialtyName ? (
          <View className="mt-4 flex-row items-center gap-2 rounded-xl bg-accent/50 px-4 py-3">
            <Wrench size={16} color="#1D4ED8" />
            <Text className="text-sm font-medium text-accent-foreground">
              Specialises in {specialtyName}
            </Text>
          </View>
        ) : null}

        <View className="mt-5 space-y-2">
          {rows.map(({ icon: Icon, label, to }) => (
            <Link key={label} href={to} asChild>
              <Pressable className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
                <Icon size={16} color="#208AEF" />
                <Text className="flex-1 text-sm font-medium">{label}</Text>
                <ChevronRight size={16} color="#71717A" />
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}
