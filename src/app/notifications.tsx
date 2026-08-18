import { useFocusEffect } from 'expo-router';
import { Bell, MessageCircle } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

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
            <ActivityIndicator color="#208AEF" />
          </View>
        ) : items.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-card">
              <Bell size={28} color="#71717A" />
            </View>
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
              <View
                className={cn(
                  'h-10 w-10 shrink-0 items-center justify-center rounded-full',
                  n.read ? 'bg-card' : 'bg-primary',
                )}>
                {n.title.toLowerCase().includes('message') ? (
                  <MessageCircle size={16} color={n.read ? '#208AEF' : '#FFFFFF'} />
                ) : (
                  <Bell size={16} color={n.read ? '#208AEF' : '#FFFFFF'} />
                )}
              </View>
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
