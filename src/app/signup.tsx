import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, Lock, Mail, MapPin, Phone, User, Wrench } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/handyhub/screen-header';
import { categories } from '@/lib/handyhub-data';
import type { UserRole } from '@/lib/store';
import { saveSession } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function SignUp() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { role: roleParam } = useLocalSearchParams<{ role?: string }>();
  const role: UserRole = roleParam === 'worker' ? 'worker' : 'client';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [specialtyOpen, setSpecialtyOpen] = useState(false);
  const selectedSpecialty = categories.find((c) => c.slug === specialty);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password) {
      Alert.alert('Missing details', 'Please fill in every field.');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Passwords do not match', 'Please re-enter your password.');
      return;
    }
    if (role === 'worker' && !specialty) {
      Alert.alert('Select your trade', 'Please choose what service you specialise in.');
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setSubmitting(false);
    if (error) {
      Alert.alert('Sign up failed', error.message);
      return;
    }
    if (!data.session) {
      Alert.alert(
        'Check your email',
        'Please confirm your email address first, then log in.',
      );
      return;
    }
    const user = data.user;
    if (!user) return;
    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      location: location.trim(),
      specialty,
    });
    if (profileError) {
      Alert.alert('Sign up failed', profileError.message);
      return;
    }
    await saveSession({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      location: location.trim(),
      specialty,
    });
    router.push('/home');
  };

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader back="/role" />
      <ScrollView className="flex-1 px-7 pb-10">
        <Text className="text-2xl font-bold">Create your account</Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          It only takes a minute to get set up.
        </Text>
        <View className="mt-7 space-y-3">
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <User size={16} color="#71717A" />
            <TextInput
              value={name}
              onChangeText={setName}
              autoComplete="name"
              placeholder="Full name"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Mail size={16} color="#71717A" />
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              placeholder="Email address"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Phone size={16} color="#71717A" />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              autoComplete="tel"
              placeholder="Phone number"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <MapPin size={16} color="#71717A" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              autoComplete="street-address"
              placeholder="Suburb / area"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          {role === 'worker' ? (
            <View>
              <Pressable
                onPress={() => setSpecialtyOpen((o) => !o)}
                className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
                <Wrench size={16} color="#71717A" />
                <Text
                  className={cn(
                    'flex-1 text-sm',
                    selectedSpecialty ? 'text-foreground' : 'text-muted-foreground',
                  )}>
                  {selectedSpecialty?.name || 'What do you specialise in?'}
                </Text>
                <ChevronDown size={16} color="#71717A" />
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
            <Lock size={16} color="#71717A" />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Password"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
          <View className="flex-row items-center gap-3 rounded-xl bg-card px-4 py-3.5">
            <Lock size={16} color="#71717A" />
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              secureTextEntry
              autoComplete="new-password"
              placeholder="Confirm password"
              placeholderTextColor="#71717A"
              className="flex-1 bg-transparent text-sm"
            />
          </View>
        </View>
        <Pressable onPress={submit} className="mt-7 w-full rounded-xl bg-primary px-6 py-3.5">
          <Text className="text-center text-sm font-semibold text-primary-foreground">Sign up</Text>
        </Pressable>
        <Text className="mt-5 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary">
            Log in
          </Link>
        </Text>
      </ScrollView>
    </View>
  );
}
