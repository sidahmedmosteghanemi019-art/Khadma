import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Camera } from 'lucide-react-native';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import { cn } from '@/lib/utils';

export default function RequestService() {
  const router = useRouter();
  const [service, setService] = useState<string>('');
  const [photos, setPhotos] = useState(0);

  const submit = () => {
    Alert.alert('Service requested successfully!');
    router.push('/jobs');
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Request a service" back="/home" />
      <ScrollView className="flex-1 px-5 pb-8">
        <Text className="text-sm text-muted-foreground">What can we help you with today?</Text>

        <Text className="mt-5 text-xs font-medium">What service do you need?</Text>
        <View className="mt-2 flex-row flex-wrap gap-2">
          {categories.map((c) => (
            <Pressable
              key={c.slug}
              onPress={() => setService(c.slug)}
              className={cn(
                'rounded-full border px-4 py-2',
                service === c.slug ? 'border-primary bg-primary' : 'border-border bg-card',
              )}>
              <Text
                className={cn(
                  'text-xs',
                  service === c.slug ? 'font-semibold text-primary-foreground' : 'text-foreground',
                )}>
                {c.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="mt-4 text-xs font-medium">Describe your issue</Text>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder="Tell the worker what needs doing\u2026"
          placeholderTextColor="#71717A"
          textAlignVertical="top"
          className="mt-2 w-full rounded-xl bg-card px-4 py-3.5 text-sm"
          style={{ minHeight: 96 }}
        />

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xs font-medium">Preferred date</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#71717A"
              className="mt-2 w-full rounded-xl bg-card px-3 py-3.5 text-sm"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium">Preferred time</Text>
            <TextInput
              placeholder="HH:MM"
              placeholderTextColor="#71717A"
              className="mt-2 w-full rounded-xl bg-card px-3 py-3.5 text-sm"
            />
          </View>
        </View>

        <Text className="mt-4 text-xs font-medium">Budget (optional)</Text>
        <TextInput
          keyboardType="numeric"
          placeholder="R 500"
          placeholderTextColor="#71717A"
          className="mt-2 w-full rounded-xl bg-card px-4 py-3.5 text-sm"
        />

        <Text className="mt-4 text-xs font-medium">Add a photo</Text>
        <Pressable
          onPress={() => setPhotos((p) => p + 1)}
          className="mt-2 flex-col items-center gap-1 rounded-xl border border-dashed border-border bg-card py-6">
          <Camera size={24} color="#71717A" />
          <Text className="text-xs text-muted-foreground">
            {photos > 0 ? `${photos} photo${photos > 1 ? 's' : ''} added` : 'Add photo'}
          </Text>
        </Pressable>

        <Pressable onPress={submit} className="mt-7 w-full rounded-xl bg-primary px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-primary-foreground">Next</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
