import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Camera } from 'lucide-react-native';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { showAlert } from '@/lib/alert';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function RequestService() {
  const router = useRouter();
  const [service, setService] = useState<string>('');
  const [photos, setPhotos] = useState(0);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [budget, setBudget] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!service) {
      showAlert('Pick a service', 'Choose what you need help with.');
      return;
    }
    setSubmitting(true);
    const me = (await supabase.auth.getUser()).data.user?.id;
    if (!me) {
      setSubmitting(false);
      showAlert('Not signed in', 'Please log in to request a service.');
      router.push('/login');
      return;
    }
    const { error } = await supabase.from('job_requests').insert({
      client_id: me,
      category: service,
      description: description.trim(),
      preferred_date: date.trim(),
      preferred_time: time.trim(),
      budget: budget.trim(),
    });
    setSubmitting(false);
    if (error) {
      showAlert('Request failed', error.message);
      return;
    }
    showAlert('Service requested!', 'Find it under the Requested tab in Jobs.');
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
          value={description}
          onChangeText={setDescription}
          placeholder="Tell the worker what needs doing…"
          placeholderTextColor="#5F6B62"
          textAlignVertical="top"
          className="mt-2 w-full rounded-xl bg-card px-4 py-3.5 text-sm"
          style={{ minHeight: 96 }}
        />

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="text-xs font-medium">Preferred date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#5F6B62"
              className="mt-2 w-full rounded-xl bg-card px-3 py-3.5 text-sm"
            />
          </View>
          <View className="flex-1">
            <Text className="text-xs font-medium">Preferred time</Text>
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
              placeholderTextColor="#5F6B62"
              className="mt-2 w-full rounded-xl bg-card px-3 py-3.5 text-sm"
            />
          </View>
        </View>

        <Text className="mt-4 text-xs font-medium">Budget (optional)</Text>
        <TextInput
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
          placeholder="R 500"
          placeholderTextColor="#5F6B62"
          className="mt-2 w-full rounded-xl bg-card px-4 py-3.5 text-sm"
        />

        <Text className="mt-4 text-xs font-medium">Add a photo</Text>
        <Pressable
          onPress={() => setPhotos((p) => p + 1)}
          className="mt-2 flex-col items-center gap-1 rounded-xl border border-dashed border-border bg-card py-6">
          <Camera size={24} color="#5F6B62" />
          <Text className="text-xs text-muted-foreground">
            {photos > 0 ? `${photos} photo${photos > 1 ? 's' : ''} added` : 'Add photo'}
          </Text>
        </Pressable>

        <Pressable
          onPress={submit}
          disabled={submitting}
          className="mt-7 w-full rounded-xl bg-primary px-6 py-3.5 disabled:opacity-60">
          <Text className="text-center text-sm font-semibold text-primary-foreground">
            {submitting ? 'Sending request…' : 'Next'}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
