# Phase 4B - Local Reminders

## Goal

Add local daily check-in reminders so users are more likely to keep a consistent record.

The goal is habit support, not medical monitoring.

## Problem being solved

The app is more useful when check-ins are consistent. Carers may forget to record daily changes, especially during stressful periods.

A simple local reminder can help users remember to add a check-in.

## Scope included

- Add local reminder settings.
- Add local notification permission flow.
- Schedule a daily local reminder.
- Disable/cancel the reminder.
- Store reminder preference locally.
- Keep reminders user-controlled.

## Scope intentionally excluded

- No backend push notifications.
- No server-side reminders.
- No care-team alerts.
- No emergency escalation.
- No diagnosis or clinical monitoring claims.
- No tenant/RBAC.

## Product value

Reminders help users maintain a useful timeline of observations.

This strengthens the app's core value: tracking daily changes and creating summaries that can support care conversations.

## Safety and privacy notes

Reminders are local to the device and user-triggered.

Reminder copy should not imply urgent medical monitoring. It should simply encourage a check-in.

## Manual QA checklist

- Open Settings.
- Enable daily reminder.
- Grant notification permission.
- Confirm reminder preference is saved.
- Disable daily reminder.
- Confirm reminder is cancelled.
- Confirm app still works if permission is denied.

## Interview talking points

Use this story:

> I added local reminders to improve habit formation without introducing backend push infrastructure. I kept the feature local-only and user-controlled, because this MVP is not a clinical monitoring system or emergency alert product.
