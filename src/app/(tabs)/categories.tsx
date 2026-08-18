import { Link } from 'expo-router';
import { useState } from 'react';
import { Search } from 'lucide-react-native';
import { Pressable, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categoryIcons } from '@/components/handyhub/category-icons';
import { categories } from '@/lib/handyhub-data';

export default function Categories() {
  const [q, setQ] = useState('');
  const list = categories.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="All categories" back="/home" />
      <View className="flex-1 px-5 py-5">
        <View className="flex-row items-center gap-2 rounded-xl bg-card px-4 py-3">
          <Search size={16} color="#71717A" />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search categories"
            placeholderTextColor="#71717A"
            className="flex-1 bg-transparent text-sm"
          />
        </View>
        <View className="mt-5 flex-row flex-wrap justify-between">
          {list.map((c) => {
            const Icon = categoryIcons[c.icon]!;
            return (
              <Link key={c.slug} href={`/service/${c.slug}`} asChild>
                <Pressable className="mb-3 w-[31%] flex-col items-center gap-2 rounded-2xl bg-card px-2 py-5">
                  <Icon size={24} color="#208AEF" />
                  <Text className="text-center text-xs font-medium">{c.name}</Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
        {list.length === 0 && (
          <Text className="mt-10 text-center text-sm text-muted-foreground">
            No categories match {'\u201C'}
            {q}
            {'\u201D'}.
          </Text>
        )}
      </View>
    </View>
  );
}
