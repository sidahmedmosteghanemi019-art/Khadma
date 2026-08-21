import { Link } from "expo-router";
import { Bell, MapPin, Search, Wrench } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { showAlert } from '@/lib/alert';
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { categoryIcons } from "@/components/handyhub/category-icons";
import { IconCircle } from "@/components/handyhub/icon-circle";
import { Stars } from "@/components/handyhub/stars";
import { categories, jobs, workers } from "@/lib/handyhub-data";
import type { JobStatus } from "@/lib/handyhub-data";
import type { UserRole } from "@/lib/store";
import { getSession } from "@/lib/store";
import { cn } from "@/lib/utils";

const statusBadge = (status: JobStatus) =>
  cn(
    "rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize",
    status === "ongoing" && "bg-accent/60 text-accent-foreground",
    status === "requested" && "bg-primary/10 text-primary",
    status === "completed" && "bg-muted text-muted-foreground",
  );

function ClientHome({ name, location }: { name: string; location: string }) {
  const insets = useSafeAreaInsets();
  const firstName = name ? name.trim().split(/\s+/)[0] : "there";
  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top }}>
      <View className="px-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            {location ? (
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color="#5F6B62" />
                <Text className="text-xs text-muted-foreground">{location}</Text>
              </View>
            ) : null}
            <Text className="mt-1 text-2xl font-bold">Hello, {firstName} 👋</Text>
            <Text className="text-sm text-muted-foreground">What can we help you with today?</Text>
          </View>
          <Link href="/notifications" asChild>
            <Pressable className="relative h-10 w-10 items-center justify-center rounded-full bg-card">
              <Bell size={20} color="#1B3B2E" />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Pressable>
          </Link>
        </View>

        <Link href="/categories" asChild>
          <Pressable className="mt-4 flex-row items-center gap-2 rounded-xl bg-card px-4 py-3">
            <Search size={16} color="#5F6B62" />
            <Text className="text-sm text-muted-foreground">Search for a service…</Text>
          </Pressable>
        </Link>
      </View>

      <View className="space-y-7 px-5 py-6">
        <View>
          <View className="mb-3 flex-row items-baseline justify-between">
            <Text className="text-base font-semibold">Popular services</Text>
            <Link href="/categories" asChild>
              <Pressable>
                <Text className="text-xs font-medium text-primary">See all</Text>
              </Pressable>
            </Link>
          </View>
          <View className="flex-row flex-wrap justify-between">
            {categories.slice(0, 8).map((c) => {
              const Icon = categoryIcons[c.icon]!;
              return (
                <Link key={c.slug} href={`/service/${c.slug}`} asChild>
                  <Pressable className="mb-3 w-[22%] items-center gap-2 rounded-2xl bg-card px-1 py-3">
                    <IconCircle icon={Icon} size={18} circle={36} />
                    <Text className="text-center text-[11px] font-medium">{c.name}</Text>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </View>

        <View className="rounded-2xl bg-primary p-5">
          <Text className="text-base font-semibold text-primary-foreground">
            Support your local hustle
          </Text>
          <Text className="mt-1 text-xs text-primary-foreground/80">
            Every job booked keeps skills and income in the neighbourhood.
          </Text>
          <Link href="/request" asChild>
            <Pressable className="mt-4 self-start rounded-lg bg-brand-lime px-4 py-2">
              <Text className="text-xs font-semibold text-brand-deep">Request a service</Text>
            </Pressable>
          </Link>
        </View>

        <View>
          <View className="mb-3 flex-row items-baseline justify-between">
            <Text className="text-base font-semibold">Top-rated workers</Text>
            <Link href="/categories" asChild>
              <Pressable>
                <Text className="text-xs font-medium text-primary">See all</Text>
              </Pressable>
            </Link>
          </View>
          <View className="space-y-3">
            {workers.map((w) => (
              <Link key={w.id} href={`/worker/${w.id}`} asChild>
                <Pressable className="flex-row items-center gap-3 rounded-2xl bg-card p-3">
                  <View className="h-12 w-12 items-center justify-center rounded-full bg-accent/70">
                    <Text className="text-sm font-semibold text-primary">{w.avatar}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold">{w.name}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {w.trade} · {w.distance}
                    </Text>
                    <Stars value={w.rating} className="mt-1" />
                  </View>
                  <Text className="text-xs font-semibold text-primary">{w.rate}</Text>
                </Pressable>
              </Link>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function WorkerHome({ name, location, specialty }: { name: string; location: string; specialty: string }) {
  const insets = useSafeAreaInsets();
  const [available, setAvailable] = useState(true);
  const firstName = name ? name.trim().split(/\s+/)[0] : "there";
  const specialtyName = specialty
    ? categories.find((c) => c.slug === specialty)?.name ?? specialty
    : "";
  const relevantJobs = specialty ? jobs.filter((j) => j.category === specialty) : jobs;
  const active = relevantJobs.filter((j) => j.status !== "completed").length;
  const earned = relevantJobs
    .filter((j) => j.status === "completed")
    .reduce((sum, j) => sum + parseInt(j.price.replace(/[^0-9]/g, ""), 10), 0);

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingTop: insets.top }}>
      <View className="px-5 pt-6">
        <View className="flex-row items-start justify-between">
          <View>
            {location ? (
              <View className="flex-row items-center gap-1">
                <MapPin size={14} color="#5F6B62" />
                <Text className="text-xs text-muted-foreground">{location}</Text>
              </View>
            ) : null}
            <Text className="mt-1 text-2xl font-bold">Hello, {firstName} 👋</Text>
            <Text className="text-sm text-muted-foreground">
              Here's what's happening with your jobs.
            </Text>
            {specialtyName ? (
              <View className="mt-1 flex-row items-center gap-1.5">
                <Wrench size={14} color="#1B3B2E" />
                <Text className="text-xs font-semibold text-primary">{specialtyName}</Text>
              </View>
            ) : null}
          </View>
          <Link href="/notifications" asChild>
            <Pressable className="relative h-10 w-10 items-center justify-center rounded-full bg-card">
              <Bell size={20} color="#1B3B2E" />
              <View className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </Pressable>
          </Link>
        </View>

        <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-card p-4">
          <View className="flex-1 pr-3">
            <Text className="text-sm font-semibold">
              {available ? "Available for new jobs" : "Currently unavailable"}
            </Text>
            <Text className="mt-0.5 text-xs text-muted-foreground">
              {available ? "Clients can book you right now." : "You won't receive new job offers."}
            </Text>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ true: "#1B3B2E", false: "#DDDDD2" }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View className="mt-4 flex-row gap-3">
          <View className="flex-1 rounded-2xl bg-card p-4">
            <Text className="text-xl font-bold">{active}</Text>
            <Text className="mt-1 text-[11px] text-muted-foreground">Active jobs</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-card p-4">
            <Text className="text-xl font-bold">4.8</Text>
            <Text className="mt-1 text-[11px] text-muted-foreground">Rating</Text>
          </View>
          <View className="flex-1 rounded-2xl bg-card p-4">
            <Text className="text-xl font-bold">R{earned}</Text>
            <Text className="mt-1 text-[11px] text-muted-foreground">Earned</Text>
          </View>
        </View>
      </View>

      <View className="space-y-3 px-5 py-6">
        <View className="flex-row items-baseline justify-between">
          <Text className="text-base font-semibold">Jobs for you</Text>
          <Link href="/jobs" asChild>
            <Pressable>
              <Text className="text-xs font-medium text-primary">See all</Text>
            </Pressable>
          </Link>
        </View>
        {relevantJobs.map((j) => (
          <View key={j.id} className="rounded-2xl bg-card p-4">
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-sm font-semibold">{j.service}</Text>
              <Text className={statusBadge(j.status)}>{j.status}</Text>
            </View>
            <Text className="mt-1 text-xs text-muted-foreground">
              {j.date} · {j.price}
            </Text>
            {j.status === "requested" ? (
              <Pressable
                onPress={() =>
                  showAlert("Job accepted", `${j.service} has been added to your active jobs.`)
                }
                className="mt-3 self-start rounded-lg bg-primary px-4 py-2">
                <Text className="text-xs font-semibold text-primary-foreground">Accept job</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
        {relevantJobs.length === 0 && (
          <Text className="pt-6 text-center text-sm text-muted-foreground">
            No {specialtyName || "new"} jobs in your trade yet.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

export default function HomeScreen() {
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("client");
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");

  useEffect(() => {
    getSession().then((s) => {
      if (s?.name) setName(s.name);
      if (s?.location) setLocation(s.location);
      if (s?.specialty) setSpecialty(s.specialty);
      setRole(s?.role ?? "client");
    });
  }, []);

  if (role === "worker") return <WorkerHome name={name} location={location} specialty={specialty} />;
  return <ClientHome name={name} location={location} />;
}
