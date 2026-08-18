import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'client' | 'worker';

export type Session = {
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string;
  specialty: string;
};

export type StoredMessage = {
  id: string;
  from: 'me' | 'them';
  text: string;
  time: string;
};

export type Conversation = {
  workerId: string;
  messages: StoredMessage[];
};

const SESSION_KEY = 'handyhub.session';
const CONVERSATIONS_KEY = 'handyhub.conversations';

export async function getSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getConversations(): Promise<Record<string, StoredMessage[]>> {
  try {
    const raw = await AsyncStorage.getItem(CONVERSATIONS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, StoredMessage[]>) : {};
  } catch {
    return {};
  }
}

export async function appendMessages(workerId: string, msgs: StoredMessage[]): Promise<void> {
  const all = await getConversations();
  const next = { ...all, [workerId]: [...(all[workerId] ?? []), ...msgs] };
  await AsyncStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(next));
}

export function nowTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
