import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import { showAlert } from '@/lib/alert';
import type { UserRole } from '@/lib/store';
import { getSession } from '@/lib/store';
import type { JobRequestRow } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type TabKey = JobRequestRow['status'];

const tabs: { key: TabKey; label: string }[] = [
  { key: 'ongoing', label: 'Ongoing' },
  { key: 'requested', label: 'Requested' },
  { key: 'completed', label: 'Completed' },
];

const statusStyles: Record<TabKey, { pill: string; text: string }> = {
  ongoing: { pill: 'bg-primary/10', text: 'text-primary' },
  requested: { pill: 'bg-accent', text: 'text-accent-foreground' },
  completed: { pill: 'bg-muted', text: 'text-muted-foreground' },
};

export default function MyJobs() {
  const [tab, setTab] = useState<TabKey>('requested');
  const [role, setRole] = useState<UserRole>('client');
  const [items, setItems] = useState<JobRequestRow[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const me = (await supabase.auth.getUser()).data.user?.id;
    if (!me) {
      setLoaded(true);
      return;
    }
    const { data } = await supabase
      .from('job_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoaded(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    getSession().then((s) => {
      setRole(s?.role ?? 'client');
    });
  }, []);

  const list = items.filter((j) => j.status === tab);

  const accept = async (id: string, service: string) => {
    const { error } = await supabase
      .from('job_requests')
      .update({ status: 'ongoing' })
      .eq('id', id);
    if (error) {
      showAlert('Could not accept', error.message);
      return;
    }
    showAlert('Job accepted', `${service} moved to Ongoing.`);
    load();
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="My jobs" back="/home" />
      {!loaded ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#1B3B2E" />
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 py-5" contentContainerStyle={{ paddingBottom: 24 }}>
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

          <View className="mt-5 gap-3">
            {list.map((j) => {
              const serviceName =
                categories.find((c) => c.slug === j.category)?.name ?? j.category ?? 'Service';
              return (
                <View key={j.id} className="rounded-2xl bg-card p-4">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold">{serviceName}</Text>
                      <Text className="mt-0.5 text-xs text-muted-foreground" numberOfLines={2}>
                        {j.description || 'No description provided'}
                      </Text>
                      <Text className="mt-0.5 text-xs text-muted-foreground">
                        {[j.preferred_date || 'Flexible date', j.preferred_time]
                          .filter(Boolean)
                          .join(' · ')}
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
                    <Text className="text-sm font-semibold text-primary">
                      {j.budget ? `R ${j.budget}` : 'Budget open'}
                    </Text>
                    {role === 'worker' && j.status === 'requested' ? (
                      <Pressable
                        onPress={() => accept(j.id, serviceName)}
                        className="rounded-lg bg-brand-orange px-3 py-1.5">
                        <Text className="text-[11px] font-semibold text-white">Accept job</Text>
                      </Pressable>
                    ) : null}
                  </View>
                </View>
              );
            })}
            {list.length === 0 && (
              <Text className="pt-10 text-center text-sm text-muted-foreground">
                Nothing here yet.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}
