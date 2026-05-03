import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { logger } from './logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Top-level error boundary. Shows a safe, non-PII error screen in production.
 * Never renders stack traces or patient data in the fallback UI.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('Unhandled render error', { name: error.name });
    // In production, error.message and info.componentStack are NOT logged
    // to avoid leaking PII that may have ended up in component props.
    if (process.env.NODE_ENV === 'development') {
      console.error(error, info.componentStack);
    }
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>⚠️</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.body}>
            Please close and reopen the app. Your data is safe on this device.
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#f7f8fb',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f2c4a',
    marginBottom: 12,
    textAlign: 'center',
  },
  body: {
    fontSize: 15,
    color: '#6b7a8f',
    textAlign: 'center',
    lineHeight: 22,
  },
});
