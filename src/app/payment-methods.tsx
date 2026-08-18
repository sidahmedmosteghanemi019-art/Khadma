import { Plus } from 'lucide-react-native';
import { Alert, Pressable, Text, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';

const cards = [
  { brand: 'VISA', digits: '•••• •••• •••• 4821', exp: '09/27' },
  { brand: 'Mastercard', digits: '•••• •••• •••• 7390', exp: '04/26' },
];

export default function PaymentMethods() {
  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Payment methods" back="/profile" />
      <View className="flex-1 px-5 pb-8">
        <View className="space-y-3">
          {cards.map((c) => (
            <View key={c.digits} className="flex-row items-center gap-4 rounded-2xl bg-card p-4">
              <View className="h-9 w-14 items-center justify-center rounded-md bg-primary">
                <Text className="text-[10px] font-bold text-primary-foreground">
                  {c.brand === 'VISA' ? 'VISA' : 'MC'}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium">{c.digits}</Text>
                <Text className="text-[11px] text-muted-foreground">Expires {c.exp}</Text>
              </View>
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => Alert.alert('Card form coming soon')}
          className="mt-5 flex-row items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3.5">
          <Plus size={16} color="#208AEF" />
          <Text className="text-sm font-medium text-primary">Add a card</Text>
        </Pressable>
      </View>
    </View>
  );
}
