import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { cn } from '@/lib/utils';

type ScreenHeaderProps = {
  title?: string;
  back?: Href;
  right?: ReactNode;
  onDark?: boolean;
};

export function ScreenHeader({ title, back, right, onDark }: ScreenHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex-row items-center px-2"
      style={{ paddingTop: insets.top + 8 }}>
      {back ? (
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.push(back))}
          className="h-10 w-10 items-center justify-center rounded-full"
          hitSlop={8}>
          <ChevronLeft size={22} color={onDark ? '#FFFFFF' : '#09090B'} />
        </Pressable>
      ) : (
        <View className="h-10 w-10" />
      )}
      <View className="flex-1 items-center">
        {title ? (
          <Text className={cn('text-base font-semibold', onDark ? 'text-white' : 'text-foreground')}>
            {title}
          </Text>
        ) : null}
      </View>
      {right ? (
        <View className="h-10 min-w-10 items-center justify-center">{right}</View>
      ) : (
        <View className="h-10 w-10" />
      )}
    </View>
  );
}
