import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { jobs } from '@/lib/handyhub-data';
import type { Job } from '@/lib/handyhub-data';
import type { UserRole } from '@/lib/store';
import { getSession } from '@/lib/store';
import { cn } from '@/lib/utils';

const tabs: { key: Job['status']; label: string }[] = [
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'requested', label: 'Requested' },
  { key: 'completed', label: 'Completed' },
];

const statusStyles: Record<Job['status'], { pill: string; text: string }> = {
  ongoing: { pill: 'bg-primary/10', text: 'text-primary' },
  requested: { pill: 'bg-accent', text: 'text-accent-foreground' },
  completed: { pill: 'bg-muted', text: 'text-muted-foreground' },
};

export default function MyJobs() {
  const [tab, setTab] = useState<Job['status']>('ongoing');
  const [role, setRole] = useState<UserRole>('client');
  const [specialty, setSpecialty] = useState('');

  useEffect(() => {
    getSession().then((s) => {
      setRole(s?.role ?? 'client');
      if (s?.specialty) setSpecialty(s.specialty);
    });
  }, []);

  const relevant =
    role === 'worker' && specialty ? jobs.filter((j) => j.category === specialty) : jobs;
  const list = relevant.filter((j) => j.status === tab);
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="My jobs" back="/home" />
      <ScrollView className="flex-1 px-5 py-5">
        <View className="flex-row gap-2 rounded-xl bg-card p-1">
          {tabs.map((t) => (
            <Pressable
              key={t.key}
              onPress={() => setTab(t.key)}
              className={cn('flex-1 rounded-lg py-2', tab === t.key && 'bg-primary')}>
              <Text
                className={cn(
                  'text-center text-xs font-medium',
                  tab === t.key ? 'text-primary-foreground' : 'text-muted-foreground',
                )}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mt-5 space-y-3">
          {list.map((j) => (
            <View key={j.id} className="rounded-2xl bg-card p-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold">{j.service}</Text>
                  <Text className="mt-0.5 text-xs text-muted-foreground">
                    {j.worker} · {j.date}
                  </Text>
                </View>
                <View className={cn('rounded-full px-2.5 py-1', statusStyles[j.status].pill)}>
                  <Text
                    className={cn(
                      'text-[10px] font-semibold capitalize',
                      statusStyles[j.status].text,
                    )}>
                    {j.status}
                  </Text>
                </View>
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-primary">{j.price}</Text>
                <Link href="/messages" asChild>
                  <Pressable className="rounded-lg bg-primary px-3 py-1.5">
                    <Text className="text-[11px] font-semibold text-primary-foreground">
                      Message
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          ))}
          {list.length === 0 && (
            <Text className="pt-10 text-center text-sm text-muted-foreground">
              Nothing here yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
