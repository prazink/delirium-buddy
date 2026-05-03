import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type OnboardingStepCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: '/profile' | '/log';
  stepLabel: string;
};

export function OnboardingStepCard({ title, description, actionLabel, href, stepLabel }: OnboardingStepCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.stepLabel}>{stepLabel}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <Link href={href} asChild>
        <Pressable style={styles.action}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#eff6ff',
    borderColor: '#bfdbfe',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 12,
    padding: 16,
  },
  stepLabel: {
    color: '#2563eb',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  title: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  action: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionText: {
    color: '#fff',
    fontWeight: '800',
  },
});
