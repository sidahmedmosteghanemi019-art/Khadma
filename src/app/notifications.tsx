import { useFocusEffect } from 'expo-router';
import { Bell, MessageCircle } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { IconCircle } from '@/components/handyhub/icon-circle';
import { ScreenHeader } from '@/components/handyhub/screen-header';
import type { DbNotification } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Notifications() {
  const [items, setItems] = useState<DbNotification[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const me = (await supabase.auth.getUser()).data.user?.id;
    if (!me) {
      setLoaded(true);
      return;
    }
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', me)
      .order('created_at', { ascending: false });
    if (data) setItems(data);
    setLoaded(true);
    await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', me)
      .eq('read', false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Notifications" back="/home" />
      <View className="flex-1 px-5">
        {!loaded ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#1B3B2E" />
          </View>
        ) : items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <IconCircle icon={Bell} size={26} circle={64} />
            <Text className="mt-4 text-sm text-muted-foreground">
              No notifications yet.
            </Text>
          </View>
        ) : (
          items.map((n, i) => (
            <View
              key={n.id}
              className={cn(
                'flex flex-row items-start gap-3 py-4',
                i < items.length - 1 && 'border-b border-border',
              )}>
              <IconCircle
                icon={n.title.toLowerCase().includes('message') ? MessageCircle : Bell}
                size={16}
                circle={40}
                className={cn('shrink-0', n.read && 'opacity-40')}
              />
              <View className="flex-1">
                <Text className="text-sm font-semibold">{n.title}</Text>
                <Text className="text-xs text-muted-foreground">{n.body}</Text>
              </View>
              <Text className="text-[10px] text-muted-foreground">{fmtTime(n.created_at)}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
