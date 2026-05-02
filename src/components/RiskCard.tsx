import { StyleSheet, Text, View } from 'react-native';

import type { RiskState } from '../domain/risk/calculateRisk';

type RiskCardProps = {
  risk: RiskState;
};

export function RiskCard({ risk }: RiskCardProps) {
  return (
    <View style={[styles.card, { borderColor: risk.color }]}> 
      <Text style={styles.cardTitle}>Risk Level</Text>
      <Text style={[styles.big, { color: risk.color }]}>{risk.level}</Text>
      <Text style={styles.muted}>{risk.tip}</Text>
      {risk.reasons.length > 0 ? (
        <View style={styles.signals}>
          <Text style={styles.signalTitle}>Signals:</Text>
          {risk.reasons.map((reason) => (
            <Text key={reason} style={styles.muted}>
              • {reason}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  big: {
    fontSize: 28,
    fontWeight: '700',
  },
  muted: {
    color: '#475569',
  },
  signalTitle: {
    fontWeight: '600',
  },
  signals: {
    marginTop: 8,
  },
});
