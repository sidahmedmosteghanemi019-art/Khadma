import { useRouter } from 'expo-router';
import { MessageSquarePlus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import type { Profile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HH';

export default function NewChat() {
  const router = useRouter();
  const [workers, setWorkers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = (await supabase.auth.getUser()).data.user?.id;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'worker')
        .order('full_name', { ascending: true });
      if (!error && data) setWorkers(data.filter((p) => p.id !== me));
      setLoading(false);
    })();
  }, []);

  const specialtyName = (slug: string) =>
    categories.find((c) => c.slug === slug)?.name ?? 'Worker';

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="New chat" back="/messages" />
      <ScrollView className="flex-1 px-5 pb-8">
        <View className="mb-2 flex-row items-center gap-2 pt-2">
          <MessageSquarePlus size={16} color="#208AEF" />
          <Text className="text-xs text-muted-foreground">
            Pick a worker to start a fresh conversation.
          </Text>
        </View>
        {loading ? (
          <ActivityIndicator className="mt-10" color="#208AEF" />
        ) : (
          workers.map((w, i) => (
            <Pressable
              key={w.id}
              onPress={() => router.push(`/chat/${w.id}`)}
              className={`flex-row items-center gap-3 py-4 ${i < workers.length - 1 ? 'border-b border-border' : ''}`}>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-accent/70">
                <Text className="text-sm font-semibold text-primary">{initials(w.full_name)}</Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text className="text-sm font-semibold">{w.full_name}</Text>
                <Text className="text-xs text-muted-foreground">
                  {specialtyName(w.specialty)}
                  {w.location ? ` · ${w.location}` : ''}
                </Text>
              </View>
            </Pressable>
          ))
        )}
        {!loading && workers.length === 0 && (
          <Text className="pt-10 text-center text-sm text-muted-foreground">
            No workers available yet.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
