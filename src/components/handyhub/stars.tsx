import { Star } from 'lucide-react-native';
import { View } from 'react-native';

type StarsProps = {
  value: number;
  className?: string;
  size?: number;
};

export function Stars({ value, className, size = 12 }: StarsProps) {
  const filled = Math.round(value);
  return (
    <View className={className} style={{ flexDirection: 'row', gap: 2 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          color={i < filled ? '#E0722F' : '#DDDDD2'}
          fill={i < filled ? '#E0722F' : 'none'}
        />
      ))}
    </View>
  );
}
