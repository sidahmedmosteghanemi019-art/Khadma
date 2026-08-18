import { Link, useFocusEffect } from 'expo-router';
import { MessageSquarePlus, MessagesSquare } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

type Preview = {
  conversationId: string;
  otherId: string;
  name: string;
  lastText: string;
  lastAt: string;
};

const initials = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'HH';

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Messages() {
  const [items, setItems] = useState<Preview[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const me = (await supabase.auth.getUser()).data.user?.id;
    if (!me) {
      setLoaded(true);
      return;
    }
    const { data: convs } = await supabase
      .from('conversations')
      .select('*')
      .or(`user_a.eq.${me},user_b.eq.${me}`)
      .order('created_at', { ascending: false });
    if (!convs) {
      setLoaded(true);
      return;
    }
    const previews = await Promise.all(
      convs.map(async (c) => {
        const otherId = c.user_a === me ? c.user_b : c.user_a;
        const { data: peer } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', otherId)
          .maybeSingle();
        const { data: last } = await supabase
          .from('messages')
          .select('text, created_at')
          .eq('conversation_id', c.id)
          .order('created_at', { ascending: false })
          .limit(1);
        return {
          conversationId: c.id,
          otherId,
          name: peer?.full_name ?? 'Worker',
          lastText: last?.[0]?.text ?? '',
          lastAt: last?.[0]?.created_at ?? c.created_at,
        };
      }),
    );
    setItems(previews);
    setLoaded(true);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Messages"
        back="/home"
        right={
          <Link href="/new-chat" asChild>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full" hitSlop={8}>
              <MessageSquarePlus size={20} color="#208AEF" />
            </Pressable>
          </Link>
        }
      />
      {!loaded ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#208AEF" />
        </View>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center px-10">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-card">
            <MessagesSquare size={28} color="#71717A" />
          </View>
          <Text className="mt-4 text-base font-semibold">No chats yet</Text>
          <Text className="mt-1 text-center text-sm text-muted-foreground">
            Start a new chat and your conversations will show up here.
          </Text>
          <Link href="/new-chat" asChild>
            <Pressable className="mt-6 flex-row items-center gap-2 rounded-xl bg-primary px-5 py-3">
              <MessageSquarePlus size={16} color="#FFFFFF" />
              <Text className="text-sm font-semibold text-primary-foreground">
                Start a new chat
              </Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <View className="flex-1 px-5">
          {items.map((item, i) => (
            <Link key={item.conversationId} href={`/chat/${item.otherId}`} asChild>
              <Pressable
                className={cn(
                  'flex-row items-center gap-3 py-4',
                  i < items.length - 1 && 'border-b border-border',
                )}>
                <View className="h-12 w-12 items-center justify-center rounded-full bg-accent/70">
                  <Text className="text-sm font-semibold text-primary">
                    {initials(item.name)}
                  </Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-sm font-semibold">{item.name}</Text>
                  <Text className="truncate text-xs text-muted-foreground">
                    {item.lastText || 'Start the conversation'}
                  </Text>
                </View>
                <Text className="text-[10px] text-muted-foreground">{fmtTime(item.lastAt)}</Text>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </View>
  );
}
