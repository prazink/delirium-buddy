
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "expo-router";
import { View, Text, Button, StyleSheet, ActivityIndicator } from "react-native";
import { loadLogs } from "./lib/storage";
import type { LogEntry } from "./types";
import { calculateRisk } from "./lib/risk";
import { VictoryArea, VictoryChart, VictoryAxis, VictoryTheme, VictoryLegend, VictoryLine } from "victory-native";
import { useFocusEffect } from "@react-navigation/native";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  useEffect(() => { (async () => { setLogs(await loadLogs()); setLoading(false); })(); }, []);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      (async () => {
        setLoading(true);
        const data = await loadLogs();
        if (isActive) {
          setLogs(data);
          setLoading(false);
        }
      })();
      return () => { isActive = false; };
    }, [])
  );

  const riskState = useMemo(() => calculateRisk(logs), [logs]);
  const series = useMemo(() => logs.map(l => ({ x: l.date, agitation: l.agitation, confusion: l.confusion, sleep: l.sleepHours })), [logs]);

  if (loading) return <View style={s.center}><ActivityIndicator /></View>;

  return (
    <View style={s.container}>
      <Text style={s.title}>Delirium Buddy</Text>
      <View style={[s.card, { borderColor: riskState.color }]}> 
        <Text style={s.cardTitle}>Risk Level</Text>
        <Text style={[s.big, { color: riskState.color }]}>{riskState.level}</Text>
        <Text style={s.muted}>{riskState.tip}</Text>
        {riskState.reasons.length ? (
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontWeight: "600" }}>Signals:</Text>
            {riskState.reasons.map((r, i) => <Text key={i} style={s.muted}>• {r}</Text>)}
          </View>
        ) : null}
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Trends</Text>
        {series.length ? (
          <VictoryChart theme={VictoryTheme.material} domainPadding={{ x: 12, y: 10 }}>
            <VictoryAxis tickFormat={(t) => (typeof t === "string" ? t.slice(5) : t)} />
            <VictoryAxis dependentAxis />
            <VictoryLegend x={20} orientation="horizontal" gutter={18} data={[{ name: "Agitation" }, { name: "Confusion" }, { name: "Sleep (h)" }]} />
            <VictoryArea data={series} y={(d: any) => d.agitation} style={{ data: { fill: "#fca5a5", stroke: "#ef4444" } }} />
            <VictoryArea data={series} y={(d: any) => d.confusion} style={{ data: { fill: "#fde68a", stroke: "#ca8a04" } }} />
            <VictoryLine data={series} y={(d: any) => d.sleep} style={{ data: { stroke: "#10b981" } }} />
          </VictoryChart>
        ) : (
          <Text style={s.muted}>No data yet.</Text>
        )}
      </View>

      <View style={s.row}>
        <Link href="/log" asChild><Button title="New Log" /></Link>
        <Link href="/history" asChild><Button title="History" /></Link>
        <Link href="/about" asChild><Button title="About" /></Link>
      </View>
    </View>
  );
}
const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "#e5e7eb" },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  big: { fontSize: 28, fontWeight: "700" },
  muted: { color: "#475569" },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});
