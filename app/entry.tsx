import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { loadLogs } from "./lib/storage";
import type { LogEntry } from "./types";
import { calculateRisk } from "./lib/risk";

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<LogEntry | null>(null);

  useEffect(() => {
    (async () => {
      const all = await loadLogs();
      setItem(all.find((l) => l.id === id) || null);
      setLoading(false);
    })();
  }, [id]);

  const risk = useMemo(() => (item ? calculateRisk([item]) : null), [item]);

  if (loading) return <View style={s.center}><ActivityIndicator /></View>;
  if (!item) return <View style={s.center}><Text>Entry not found.</Text></View>;

  return (
    <View style={s.container}>
      <Text style={s.title}>Entry {item.date}</Text>

      {risk && (
        <View style={[s.card, { borderColor: risk.color }]}> 
          <Text style={s.cardTitle}>Risk Level</Text>
          <Text style={[s.big, { color: risk.color }]}>{risk.level}</Text>
          <Text style={s.muted}>{risk.tip}</Text>
          {risk.reasons.length ? (
            <View style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "600" }}>Signals:</Text>
              {risk.reasons.map((r, i) => <Text key={i} style={s.muted}>• {r}</Text>)}
            </View>
          ) : null}
        </View>
      )}

      <View style={s.card}>
        <Text style={s.cardTitle}>Details</Text>
        <Text>Date: {item.date}</Text>
        <Text>Agitation: {item.agitation}</Text>
        <Text>Confusion: {item.confusion}</Text>
        <Text>Sleep: {item.sleepHours}h</Text>
        {item.medsChanged ? <Text>Meds changed</Text> : null}
        {item.feverOrInfection ? <Text>Fever/Infection</Text> : null}
        {item.notes ? <Text style={{ marginTop: 6 }}>{item.notes}</Text> : null}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  big: { fontSize: 28, fontWeight: "700" },
  muted: { color: "#475569" },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});


