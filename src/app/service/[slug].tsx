import { Link, useLocalSearchParams } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { categoryIcons } from '@/components/handyhub/category-icons';
import { ScreenHeader } from '@/components/handyhub/screen-header';
import { Stars } from '@/components/handyhub/stars';
import { categories } from '@/lib/handyhub-data';
import type { Profile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

const perks = ['24/7 availability', 'Vetted, reviewed workers', 'Affordable rates'];

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HH';

export default function ServiceDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const [workers, setWorkers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'worker')
        .eq('specialty', category.slug)
        .order('rating', { ascending: false });
      if (!error && data) setWorkers(data);
      setLoading(false);
    })();
  }, [category]);

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-sm text-muted-foreground">Service not found</Text>
      </View>
    );
  }
  const Icon = categoryIcons[category.icon]!;
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/categories" />
      <ScrollView className="flex-1 px-5 pb-6">
        <View className="h-40 items-center justify-center rounded-2xl bg-primary">
          <Icon size={56} strokeWidth={1.5} color="#FFFFFF" />
        </View>
        <Text className="mt-5 text-2xl font-bold">{category.name}</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{category.blurb}</Text>
        <View className="mt-5 space-y-2">
          {perks.map((p) => (
            <View key={p} className="flex-row items-center gap-2">
              <CheckCircle2 size={16} color="#1B3B2E" />
              <Text className="text-sm">{p}</Text>
            </View>
          ))}
        </View>
        <Text className="mt-7 text-base font-semibold">
          Top-rated {category.name.toLowerCase()} workers
        </Text>
        <View className="mt-3 space-y-3">
          {loading ? (
            <ActivityIndicator className="mt-4" color="#1B3B2E" />
          ) : (
            workers.map((w) => (
              <Link key={w.id} href={`/worker/${w.id}`} asChild>
                <Pressable className="flex-row items-center gap-3 rounded-2xl bg-card p-3">
                  <View className="h-11 w-11 items-center justify-center rounded-full bg-accent/70">
                    <Text className="text-xs font-semibold text-primary">{initials(w.full_name)}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold">{w.full_name}</Text>
                    {w.rating > 0 ? (
                      <View className="mt-0.5 flex-row items-center gap-1.5">
                        <Stars value={w.rating} />
                        <Text className="text-xs font-semibold">{w.rating}</Text>
                      </View>
                    ) : (
                      <Text className="mt-0.5 text-xs text-muted-foreground">
                        {w.location || 'New on HandyHub'}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </Link>
            ))
          )}
          {!loading && workers.length === 0 && (
            <Text className="pt-6 text-center text-sm text-muted-foreground">
              No {category.name.toLowerCase()} workers available yet.
            </Text>
          )}
        </View>
      </ScrollView>
      <View className="bg-background/95 px-5 pb-8 pt-3">
        <Link href="/request" asChild>
          <Pressable className="w-full rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">
              Request this service
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
