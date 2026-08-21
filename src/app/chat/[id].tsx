import { useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { showAlert } from '@/lib/alert';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RealtimeChannel } from '@supabase/supabase-js';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import type { DbMessage, Profile } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function Chat() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [peer, setPeer] = useState<Profile | null>(null);
  const [meId, setMeId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<DbMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    let channel: RealtimeChannel | null = null;

    (async () => {
      const me = (await supabase.auth.getUser()).data.user?.id;
      if (!me) {
        setLoading(false);
        return;
      }
      setMeId(me);

      const { data: peerData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (!active) return;
      setPeer(peerData ?? null);

      const a = me < id ? me : id;
      const b = me < id ? id : me;
      let { data: conv } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_a', a)
        .eq('user_b', b)
        .maybeSingle();
      if (!conv) {
        const { data: inserted } = await supabase
          .from('conversations')
          .insert({ user_a: a, user_b: b })
          .select()
          .maybeSingle();
        conv = inserted;
      }
      if (!conv || !active) return;
      setConversationId(conv.id);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });
      if (active && msgs) setMsgs(msgs);
      setLoading(false);

      channel = supabase
        .channel(`chat:${conv.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conv.id}`,
          },
          async (payload) => {
            const msg = payload.new as DbMessage;
            setMsgs((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
            if (msg.sender_id !== me && peerData) {
              await supabase.from('notifications').insert({
                user_id: me,
                title: 'New message',
                body: `${peerData.full_name} sent you a message.`,
              });
            }
          },
        )
        .subscribe();
    })();

    return () => {
      active = false;
      if (channel) supabase.removeChannel(channel);
    };
  }, [id]);

  const send = async () => {
    if (!draft.trim() || !conversationId || !meId) return;
    const { error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: meId,
      text: draft.trim(),
    });
    if (error) {
      showAlert('Could not send', error.message);
      return;
    }
    setDraft('');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator color="#1B3B2E" />
      </View>
    );
  }

  if (!peer) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-sm text-muted-foreground">Worker not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        back="/messages"
        title={peer.full_name}
        right={<Text className="text-[11px] text-primary">Online</Text>}
      />
      <ScrollView className="flex-1 space-y-3 px-5 py-5">
        {msgs.length === 0 ? (
          <Text className="pt-8 text-center text-sm text-muted-foreground">
            Say hi to {peer.full_name} to start the conversation.
          </Text>
        ) : (
          msgs.map((m) => {
            const mine = m.sender_id === meId;
            return (
              <View key={m.id} className={cn('flex-row', mine ? 'justify-end' : 'justify-start')}>
                <View
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                    mine ? 'rounded-br-sm bg-primary' : 'rounded-bl-sm bg-card',
                  )}>
                  <Text
                    className={cn(
                      'text-sm',
                      mine ? 'text-primary-foreground' : 'text-card-foreground',
                    )}>
                    {m.text}
                  </Text>
                  <Text
                    className={cn(
                      'mt-1 text-[10px] opacity-70',
                      mine ? 'text-primary-foreground' : 'text-card-foreground',
                    )}>
                    {fmtTime(m.created_at)}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
      <View
        className="flex-row items-center gap-2 border-t border-border bg-background/95 px-4 py-3"
        style={{ paddingBottom: insets.bottom + 12 }}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message\u2026"
          placeholderTextColor="#5F6B62"
          className="flex-1 rounded-full bg-card px-4 py-3 text-sm"
        />
        <Pressable
          onPress={send}
          className="h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary">
          <Send size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}
