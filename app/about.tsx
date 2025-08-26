
import React from "react";
import { View, Text, StyleSheet } from "react-native";
export default function About() {
  return (
    <View style={a.container}>
      <Text style={a.title}>About</Text>
      <Text style={a.text}>Delirium Buddy helps families and caregivers track daily signals that may correlate with delirium risk. It does not provide medical advice. If you are concerned, seek professional care immediately.</Text>
      <Text style={[a.text, { marginTop: 8 }]}>Privacy: Your data is stored locally on your device only in this app version.</Text>
    </View>
  );
}
const a = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 12 },
  text: { color: "#334155" }
});
