import { Link, useRouter } from 'expo-router';
import { House, Leaf } from 'lucide-react-native';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import { supabase } from '@/lib/supabase';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace('/home');
    });
  }, [router]);

  return (
    <View className="flex-1 bg-brand-deep">
      <View className="flex-1 items-center justify-center gap-6 px-8">
        <View className="relative h-24 w-24 items-center justify-center rounded-3xl bg-primary-foreground/10">
          <House size={48} strokeWidth={1.5} color="#8CB84A" />
          <View className="absolute -right-1 -top-1">
            <Leaf size={28} color="#8CB84A" />
          </View>
        </View>
        <View className="items-center">
          <Text className="text-center text-5xl font-bold leading-tight text-primary-foreground">
            Handy{'\n'}
            <Text className="text-brand-lime">Hub</Text>
          </Text>
          <Text className="mt-4 text-center text-sm text-primary-foreground/80">
            People of the neighbourhood.
            {'\n'}
            Building better, together.
          </Text>
        </View>
      </View>
      <View className="px-8 pb-12">
        <Link href="/onboarding" asChild>
          <Pressable className="rounded-xl bg-brand-lime px-6 py-3.5">
            <Text className="text-center text-sm font-semibold text-brand-deep">
              Get started
            </Text>
          </Pressable>
        </Link>
        <Link href="/login" asChild>
          <Pressable className="mt-3">
            <Text className="text-center text-sm text-primary-foreground/80">
              I already have an account
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
