import { useRouter } from 'expo-router';
import { ChevronDown, Lock, Mail, MapPin, Phone, User, Wrench } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { showAlert } from '@/lib/alert';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import type { Session, UserRole } from '@/lib/store';
import { getSession, saveSession } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function PersonalInformation() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>('client');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const selectedSpecialty = categories.find((c) => c.slug === specialty);

  useEffect(() => {
    getSession().then((s) => {
      if (!s) return;
      setRole(s.role);
      setName(s.name);
      setEmail(s.email);
      setPhone(s.phone);
      setLocation(s.location);
      setSpecialty(s.specialty);
    });
  }, []);

  const save = async () => {
    if (!name.trim() || !email.trim() || !phone.trim()) {
      showAlert('Missing details', 'Please fill in every field.');
      return;
    }
    const prev = (await getSession()) ?? ({} as Session);
    await saveSession({ ...prev, name: name.trim(), email: email.trim(), phone: phone.trim(), location: location.trim(), specialty });
    showAlert('Saved', 'Your details have been updated.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader title="Personal information" back="/profile" />
      <ScrollView className="flex-1 px-7 pb-10">
        <View className="mt-4 space-y-3">
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <User size={16} color="#5F6B62" />
            <TextInput
              value={name}
              onChangeText={setName}
              autoComplete="name"
              placeholder="Full name"
              placeholderTextColor="#5F6B62"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Mail size={16} color="#5F6B62" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              placeholder="Email address"
              placeholderTextColor="#5F6B62"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Phone size={16} color="#5F6B62" />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="Phone number"
              placeholderTextColor="#5F6B62"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <MapPin size={16} color="#5F6B62" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Suburb / area"
              placeholderTextColor="#5F6B62"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          {role === 'worker' ? (
            <View>
              <Pressable
                onPress={() => setSpecialtyOpen((o) => !o)}
                className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
                <Wrench size={16} color="#5F6B62" />
                <Text
                  className={cn(
                    'flex-1 text-sm',
                    selectedSpecialty ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                  {selectedSpecialty?.name || 'What do you specialise in?'}
                </Text>
                <ChevronDown size={16} color="#5F6B62" />
              </Pressable>
              {specialtyOpen ? (
                <View className="mt-1 overflow-hidden rounded-xl bg-card">
                  {categories.map((c, i) => (
                    <Pressable
                      key={c.slug}
                      onPress={() => {
                        setSpecialty(c.slug);
                        setSpecialtyOpen(false);
                      }}
                      className={cn(
                        'px-4 py-3',
                        i < categories.length - 1 && 'border-b border-border',
                      )}>
                      <Text className={cn('text-sm', specialty === c.slug && 'font-semibold text-primary')}>
                        {c.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Lock size={16} color="#5F6B62" />
            <Text className="flex-1 text-sm text-muted-foreground">Password</Text>
            <Pressable onPress={() => router.push('/forgot-password')}>
              <Text className="text-sm font-medium text-primary">Change</Text>
            </Pressable>
          </View>
        </View>
        <Pressable onPress={save} className="mt-7 w-full rounded-xl bg-primary px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-primary-foreground">Save</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
