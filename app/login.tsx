import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { saveUser, loadUser } from "./lib/storage";
import type { User } from "./types";
import { router } from "expo-router";

export default function Login() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmitCreate() {
    try {
      setLoading(true);
      const trimmed = name.trim();
      if (!trimmed) {
        Alert.alert("Please enter your name");
        return;
      }
      const user: User = { id: String(Date.now()), name: trimmed };
      await saveUser(user);
      router.replace("/");
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setLoading(false);
    }
  }

  async function onSubmitLogin() {
    try {
      setLoading(true);
      const existing = await loadUser();
      if (existing) {
        router.replace("/");
      } else {
        Alert.alert("No user found", "Create a user to continue.");
      }
    } catch (e) {
      Alert.alert("Error", String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={s.container}>
      <Text style={s.title}>Welcome</Text>
      <Text style={s.subtitle}>Create a user or log in to continue.</Text>

      <View style={{ marginTop: 16, width: "100%" }}>
        <Text style={s.label}>Your name</Text>
        <TextInput
          style={s.input}
          placeholder="e.g. Alex"
          value={name}
          onChangeText={setName}
          editable={!loading}
          returnKeyType="done"
          onSubmitEditing={onSubmitCreate}
        />
      </View>

      <TouchableOpacity style={[s.btn, loading && s.btnDisabled]} onPress={onSubmitCreate} disabled={loading} activeOpacity={0.8}>
        {loading ? (
          <View style={s.btnInner}>
            <ActivityIndicator color="#fff" />
            <Text style={s.btnText}>Please wait…</Text>
          </View>
        ) : (
          <Text style={s.btnText}>Create User</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[s.secondaryBtn, loading && s.secondaryBtnDisabled]} onPress={onSubmitLogin} disabled={loading} activeOpacity={0.8}>
        <Text style={s.secondaryBtnText}>I already have a user</Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { color: "#475569", marginTop: 6 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 12, width: "100%" },
  btn: { backgroundColor: "#111827", paddingVertical: 14, alignItems: "center", borderRadius: 12, marginTop: 12, width: "100%" },
  btnDisabled: { opacity: 0.8 },
  btnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  btnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: { paddingVertical: 12, alignItems: "center", borderRadius: 12, marginTop: 8, width: "100%" },
  secondaryBtnDisabled: { opacity: 0.6 },
  secondaryBtnText: { color: "#111827", fontWeight: "600" },
});


