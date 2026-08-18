import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { Stars } from '@/components/handyhub/stars';
import { ratingBreakdown, reviews, workers } from '@/lib/handyhub-data';

export default function Reviews() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const worker = workers.find((w) => w.id === id);
  if (!worker) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-sm text-muted-foreground">Worker not found</Text>
      </View>
    );
  }
  const total = ratingBreakdown.reduce((a, b) => a + b.count, 0);
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Reviews" back="/home" />
      <ScrollView className="flex-1 px-5 pb-8">
        <View className="flex-row items-center gap-5">
          <View className="items-center">
            <Text className="text-4xl font-bold">{worker.rating}</Text>
            <Stars value={worker.rating} className="mt-1" />
            <Text className="mt-1 text-[11px] text-muted-foreground">{worker.reviews} reviews</Text>
          </View>
          <View className="flex-1 space-y-1">
            {ratingBreakdown.map((r) => (
              <View key={r.stars} className="flex-row items-center gap-2">
                <Text className="w-3 text-[11px] text-muted-foreground">{r.stars}</Text>
                <View className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <View
                    className="h-full rounded-full bg-star"
                    style={{ width: `${(r.count / total) * 100}%` }}
                  />
                </View>
                <Text className="w-6 text-right text-[11px] text-muted-foreground">{r.count}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-7 space-y-4">
          {reviews.map((r) => (
            <View key={r.id} className="rounded-2xl bg-card p-4">
              <View className="flex-row items-center gap-3">
                <View className="h-9 w-9 items-center justify-center rounded-full bg-accent/70">
                  <Text className="text-[11px] font-semibold text-primary">
                    {r.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text className="text-sm font-semibold">{r.name}</Text>
                  <Text className="text-[11px] text-muted-foreground">{r.date}</Text>
                </View>
              </View>
              <Stars value={r.rating} className="mt-3" />
              <Text className="mt-2 text-sm text-muted-foreground">{r.body}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
