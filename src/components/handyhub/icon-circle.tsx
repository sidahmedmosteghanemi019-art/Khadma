import type { LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';

import { cn } from '@/lib/utils';

export function IconCircle({
  icon: Icon,
  size = 16,
  circle = 32,
  className,
}: {
  icon: LucideIcon;
  size?: number;
  circle?: number;
  className?: string;
}) {
  return (
    <View
      className={cn('items-center justify-center rounded-full bg-brand-forest', className)}
      style={{ width: circle, height: circle }}>
      <Icon size={size} color="#8CB84A" />
    </View>
  );
}
