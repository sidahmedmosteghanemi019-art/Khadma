import { Link, useLocalSearchParams } from 'expo-router';
import { BadgeCheck, Clock, MapPin, MessageCircle } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { Stars } from '@/components/handyhub/stars';
import { categories, workers } from '@/lib/handyhub-data';
import type { Worker } from '@/lib/handyhub-data';
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

export default function WorkerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      setProfile(data ?? null);
      setLoading(false);
    })();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#1B3B2E" />
      </View>
    );
  }

  if (profile) {
    const specialty = categories.find((c) => c.slug === profile.specialty)?.name ?? 'Worker';
    return (
      <View className="flex-1 bg-background">
        <ScreenHeader back="/home" />
        <ScrollView className="flex-1 px-5 pb-6">
          <View className="flex-col items-center text-center">
            <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/70">
              <Text className="text-xl font-bold text-primary">{initials(profile.full_name)}</Text>
            </View>
            <Text className="mt-3 text-xl font-bold">{profile.full_name}</Text>
            <Text className="text-sm text-muted-foreground">{specialty}</Text>
            {profile.rating > 0 && (
              <View className="mt-2 flex-row items-center gap-2">
                <Stars value={profile.rating} />
                <Text className="text-sm font-semibold">{profile.rating}</Text>
              </View>
            )}
          </View>

          <View className="mt-6 space-y-2 rounded-2xl bg-card p-4">
            {profile.location ? (
              <View className="flex-row items-center gap-2">
                <MapPin size={16} color="#1B3B2E" />
                <Text className="text-sm">{profile.location}</Text>
              </View>
            ) : null}
            <View className="flex-row items-center gap-2">
              <Clock size={16} color="#1B3B2E" />
              <Text className="text-sm">Responds within 1 hour</Text>
            </View>
            <View className="flex-row items-center gap-2">
              <BadgeCheck size={16} color="#1B3B2E" />
              <Text className="text-sm">ID verified</Text>
            </View>
          </View>

          <Text className="mt-6 text-base font-semibold">About</Text>
          <Text className="mt-1 text-sm text-muted-foreground">
            {profile.about || `${profile.full_name} is a ${specialty.toLowerCase()} on HandyHub.`}
          </Text>
        </ScrollView>

        <View className="flex-row gap-3 bg-background/95 px-5 pb-8 pt-3">
          <Link href={`/chat/${profile.id}`} asChild>
            <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-brand-forest">
              <MessageCircle size={20} color="#8CB84A" />
            </Pressable>
          </Link>
          <Link href="/request" asChild>
            <Pressable className="flex-1 rounded-xl bg-primary px-6 py-3.5">
              <Text className="text-center text-sm font-semibold text-primary-foreground">
                Request a quote
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  const worker: Worker | undefined = workers.find((w) => w.id === id);
  if (!worker) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-sm text-muted-foreground">Worker not found</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/home" />
      <ScrollView className="flex-1 px-5 pb-6">
        <View className="flex-col items-center text-center">
          <View className="h-20 w-20 items-center justify-center rounded-full bg-accent/70">
            <Text className="text-xl font-bold text-primary">{worker.avatar}</Text>
          </View>
          <View className="mt-3 flex-row items-center gap-1.5">
            <Text className="text-xl font-bold">{worker.name}</Text>
            {worker.verified && <BadgeCheck size={20} color="#1B3B2E" />}
          </View>
          <Text className="text-sm text-muted-foreground">{worker.trade}</Text>
          <Link href={`/reviews/${worker.id}`} asChild>
            <Pressable className="mt-2 flex-row items-center gap-2">
              <Stars value={worker.rating} />
              <Text className="text-sm font-semibold">{worker.rating}</Text>
              <Text className="text-sm text-muted-foreground">({worker.reviews} reviews)</Text>
            </Pressable>
          </Link>
        </View>

        <View className="mt-6 space-y-2 rounded-2xl bg-card p-4">
          <View className="flex-row items-center gap-2">
            <MapPin size={16} color="#1B3B2E" />
            <Text className="text-sm">{worker.distance}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Clock size={16} color="#1B3B2E" />
            <Text className="text-sm">Responds within 1 hour</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <BadgeCheck size={16} color="#1B3B2E" />
            <Text className="text-sm">ID verified {'\u00B7'} {worker.rate}</Text>
          </View>
        </View>

        <Text className="mt-6 text-base font-semibold">About</Text>
        <Text className="mt-1 text-sm text-muted-foreground">{worker.about}</Text>

        <Text className="mt-6 text-base font-semibold">Work gallery</Text>
        <View className="mt-2 flex-row gap-2">
          {['🔧', '💡', '🚿'].map((e) => (
            <View
              key={e}
              className="aspect-square flex-1 items-center justify-center rounded-xl bg-card">
              <Text className="text-2xl">{e}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="flex-row gap-3 bg-background/95 px-5 pb-8 pt-3">
        <Link href={`/chat/${worker.id}`} asChild>
          <Pressable className="h-12 w-12 items-center justify-center rounded-full bg-brand-forest">
            <MessageCircle size={20} color="#8CB84A" />
          </Pressable>
        </Link>
        <Link href="/request" asChild>
          <Pressable className="flex-1 rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">
              Request a quote
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
