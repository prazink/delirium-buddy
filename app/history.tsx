
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { loadLogs } from "./lib/storage";
import type { LogEntry } from "./types";

export default function History() {
  const [items, setItems] = useState<LogEntry[]>([]);
  useEffect(() => { (async () => setItems(await loadLogs()))(); }, []);
  return (
    <View style={h.container}>
      <Text style={h.title}>History</Text>
      <FlatList data={items} keyExtractor={(i) => i.id} renderItem={({ item }) => (
        <View style={h.row}>
          <Text style={h.date}>{item.date}</Text>
          <Text>Ag:{item.agitation}  Co:{item.confusion}  Sleep:{item.sleepHours}h</Text>
          {item.medsChanged ? <Text style={h.flag}>Meds changed</Text> : null}
          {item.feverOrInfection ? <Text style={h.flag}>Fever/Infection</Text> : null}
          {item.notes ? <Text style={h.notes}>{item.notes}</Text> : null}
        </View>
      )} ListEmptyComponent={<Text style={{ color: '#475569' }}>No entries yet.</Text>} />
    </View>
  );
}
const h = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  row: { backgroundColor: "#fff", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 10 },
  date: { fontWeight: "600", marginBottom: 4 },
  notes: { color: "#334155", marginTop: 4 },
  flag: { color: "#dc2626", fontWeight: "600" }
});
