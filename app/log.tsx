
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Alert, Switch, ActivityIndicator, TouchableOpacity, Platform, Modal } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { todayISO, clamp } from "./lib/utils";
import { loadLogs, saveLogs } from "./lib/storage";
import { router } from "expo-router";

export default function Log() {
  const [date, setDate] = useState(todayISO());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [agitation, setAgitation] = useState("3");
  const [confusion, setConfusion] = useState("3");
  const [sleep, setSleep] = useState("6");
  const [notes, setNotes] = useState("");
  const [medsChanged, setMedsChanged] = useState(false);
  const [fever, setFever] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      setDate(`${year}-${month}-${day}`);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const confirmDate = () => {
    setShowDatePicker(false);
  };

  const cancelDate = () => {
    setShowDatePicker(false);
  };

  async function save() {
    try {
      setSaving(true);
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
    } catch (e) {
      Alert.alert("Save failed", String(e));
    } finally {
      setSaving(false);
    }
  }

  const currentDate = new Date(date);

  return (
    <View style={f.container}>
      <Text style={f.title}>New Entry</Text>
      
      {/* Date Picker Field */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: "600", marginBottom: 4 }}>Date</Text>
        <TouchableOpacity 
          style={f.dateButton} 
          onPress={showDatePickerModal}
          disabled={saving}
        >
          <Text style={f.dateButtonText}>{date}</Text>
          <Text style={f.dateButtonIcon}>📅</Text>
        </TouchableOpacity>
      </View>

      <Field label="Agitation (0-10)" value={agitation} onChangeText={setAgitation} keyboardType="number-pad" editable={!saving} />
      <Field label="Confusion (0-10)" value={confusion} onChangeText={setConfusion} keyboardType="number-pad" editable={!saving} />
      <Field label="Sleep (hours)" value={sleep} onChangeText={setSleep} keyboardType="number-pad" editable={!saving} />
      <Field label="Notes" value={notes} onChangeText={setNotes} multiline editable={!saving} />

      <View style={f.switchRow}><Text>Meds changed?</Text><Switch value={medsChanged} onValueChange={setMedsChanged} disabled={saving} /></View>
      <View style={f.switchRow}><Text>Fever / Infection?</Text><Switch value={fever} onValueChange={setFever} disabled={saving} /></View>

      <TouchableOpacity style={[f.saveBtn, saving && f.saveBtnDisabled]} onPress={save} disabled={saving} activeOpacity={0.8}>
        {saving ? (
          <View style={f.saveInner}>
            <ActivityIndicator color="#fff" />
            <Text style={f.saveText}>Saving...</Text>
          </View>
        ) : (
          <Text style={f.saveText}>Save Entry</Text>
        )}
      </TouchableOpacity>

      {/* Date Picker Modal for iOS */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={showDatePicker}
          onRequestClose={cancelDate}
        >
          <View style={f.modalOverlay}>
            <View style={f.modalContent}>
              <View style={f.modalHeader}>
                <TouchableOpacity onPress={cancelDate}>
                  <Text style={f.modalButton}>Cancel</Text>
                </TouchableOpacity>
                <Text style={f.modalTitle}>Select Date</Text>
                <TouchableOpacity onPress={confirmDate}>
                  <Text style={f.modalButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={currentDate}
                mode="date"
                display="spinner"
                onChange={handleDateChange}
                style={f.datePicker}
              />
            </View>
          </View>
        </Modal>
      )}

      {/* Date Picker for Android */}
      {Platform.OS === 'android' && showDatePicker && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}

      {saving ? (
        <View style={f.overlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#111827" />
        </View>
      ) : null}
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
  dateButton: { 
    backgroundColor: "#fff", 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: "#e5e7eb", 
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dateButtonText: { fontSize: 16, color: "#111827" },
  dateButtonIcon: { fontSize: 18 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  saveBtn: { backgroundColor: "#111827", paddingVertical: 14, alignItems: "center", borderRadius: 12 },
  saveBtnDisabled: { opacity: 0.8 },
  saveInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  saveText: { color: "#fff", fontWeight: "700" },
  overlay: { position: "absolute", left: 0, right: 0, top: 0, bottom: 0, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.05)" },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "flex-end" 
  },
  modalContent: { 
    backgroundColor: "#fff", 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    paddingBottom: 20
  },
  modalHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb"
  },
  modalTitle: { 
    fontSize: 18, 
    fontWeight: "600" 
  },
  modalButton: { 
    fontSize: 16, 
    color: "#007AFF",
    fontWeight: "600"
  },
  datePicker: { 
    height: 200 
  }
});
