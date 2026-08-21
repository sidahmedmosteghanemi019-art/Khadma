import { MapPin, Plus } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { showAlert } from '@/lib/alert';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { getSession } from '@/lib/store';

export default function SavedAddresses() {
  const [location, setLocation] = useState('');

  useEffect(() => {
    getSession().then((s) => {
      if (s?.location) setLocation(s.location);
    });
  }, []);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Saved addresses" back="/profile" />
      <View className="flex-1 px-5 pb-8">
        {location ? (
          <View className="flex-row items-center gap-3 rounded-2xl bg-card p-4">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-accent/70">
              <MapPin size={16} color="#1B3B2E" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold">Home</Text>
              <Text className="text-xs text-muted-foreground">{location}</Text>
            </View>
          </View>
        ) : (
          <Text className="pt-10 text-center text-sm text-muted-foreground">
            No saved addresses yet.
          </Text>
        )}
        <Pressable
          onPress={() => showAlert('Add address', 'This will open an address form soon.')}
          className="mt-5 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3.5">
          <Plus size={16} color="#1B3B2E" />
          <Text className="text-sm font-medium text-primary">Add an address</Text>
        </Pressable>
      </View>
    </View>
  );
}
