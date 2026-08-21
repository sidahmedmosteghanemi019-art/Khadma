import { Alert, Platform } from 'react-native';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export function showAlert(
  title: string,
  message?: string,
  buttons?: AlertButton[],
): void {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    const primary =
      buttons?.find((b) => b.style !== 'cancel' && b.style !== 'destructive') ??
      buttons?.[0];
    primary?.onPress?.();
    return;
  }
  Alert.alert(title, message, buttons);
}
