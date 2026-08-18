import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

const slides = [
  {
    title: 'Together, we build a stronger neighbourhood.',
    body: 'HandyHub brings skilled local workers and the people who need them into one place.',
  },
  {
    title: 'Find trusted workers. Get things done.',
    body: 'Browse verified plumbers, electricians, cleaners and more, all rated by your neighbours.',
  },
  {
    title: 'Support your community.',
    body: 'Every job you post keeps money and skills right where you live.',
  },
];

export default function Onboarding() {
  const [i, setI] = useState(0);
  const slide = slides[i]!;
  const last = i === slides.length - 1;
  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 px-7 pt-14">
        <View className="rounded-3xl bg-card p-6">
          <View className="h-44 items-center justify-center rounded-2xl bg-accent/60">
            <Text className="text-6xl">{['🏘️', '🛠️', '🤝'][i]}</Text>
          </View>
        </View>
        <Text className="mt-8 text-2xl font-bold leading-snug">{slide.title}</Text>
        <Text className="mt-3 text-sm text-muted-foreground">{slide.body}</Text>
        <View className="mt-8 flex-row justify-center gap-2">
          {slides.map((_, idx) => (
            <View
              key={idx}
              className={cn('h-2 rounded-full', idx === i ? 'w-6 bg-primary' : 'w-2 bg-border')}
            />
          ))}
        </View>
      </View>
      <View className="px-7 pb-10">
        {last ? (
          <Link href="/role" asChild>
            <Pressable className="w-full rounded-xl bg-primary px-6 py-3.5">
              <Text className="text-center text-sm font-semibold text-primary-foreground">Next</Text>
            </Pressable>
          </Link>
        ) : (
          <Pressable
            onPress={() => setI((v) => v + 1)}
            className="w-full rounded-xl bg-primary px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-primary-foreground">Next</Text>
          </Pressable>
        )}
        <Link href="/role" asChild>
          <Pressable className="mt-3">
            <Text className="text-center text-sm text-muted-foreground">Skip</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
