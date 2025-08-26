
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert, Switch } from "react-native";
import { todayISO, clamp } from "./lib/utils";
import { loadLogs, saveLogs } from "./lib/storage";
import { router } from "expo-router";

export default function Log() {
  const [date, setDate] = useState(todayISO());
  const [agitation, setAgitation] = useState("3");
  const [confusion, setConfusion] = useState("3");
  const [sleep, setSleep] = useState("6");
  const [notes, setNotes] = useState("");
  const [medsChanged, setMedsChanged] = useState(false);
  const [fever, setFever] = useState(false);

  async function save() {
    const items = await loadLogs();
    items.push({
      id: String(Date.now()),
      date,
      agitation: clamp(Number(agitation), 0, 10),
      confusion: clamp(Number(confusion), 0, 10),
      sleepHours: clamp(Number(sleep), 0, 24),
      medsChanged,
      feverOrInfection: fever,
      notes: notes.trim()
    });
    items.sort((a,b) => a.date.localeCompare(b.date));
    await saveLogs(items);
    Alert.alert("Saved");
    router.replace("/");
  }

  return (
    <View style={f.container}>
      <Text style={f.title}>New Entry</Text>
      <Field label="Date" value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" />
      <Field label="Agitation (0-10)" value={agitation} onChangeText={setAgitation} keyboardType="number-pad" />
      <Field label="Confusion (0-10)" value={confusion} onChangeText={setConfusion} keyboardType="number-pad" />
      <Field label="Sleep (hours)" value={sleep} onChangeText={setSleep} keyboardType="number-pad" />
      <Field label="Notes" value={notes} onChangeText={setNotes} multiline />

      <View style={f.switchRow}><Text>Meds changed?</Text><Switch value={medsChanged} onValueChange={setMedsChanged}/></View>
      <View style={f.switchRow}><Text>Fever / Infection?</Text><Switch value={fever} onValueChange={setFever}/></View>

      <Button title="Save Entry" onPress={save} />
    </View>
  );
}

function Field({ label, ...props }: any) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ fontWeight: "600", marginBottom: 4 }}>{label}</Text>
      <TextInput style={f.input} {...props} />
    </View>
  );
}
const f = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  input: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 12 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }
});
