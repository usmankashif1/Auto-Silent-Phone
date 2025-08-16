import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

async function ensureChannel() {
  return await notifee.createChannel({
    id: 'namazmode',
    name: 'Namaz Mode',
    importance: AndroidImportance.HIGH,
  });
}

export async function scheduleStartEnd(prayerName, start, end) {
  const channelId = await ensureChannel();

  // START
  if (start && start.getTime && start.getTime() > Date.now()) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: start.getTime(),
      // Wake from Doze
      alarmManager: { allowWhileIdle: true },
    };
    await notifee.createTriggerNotification(
      {
        id: `start-${prayerName}-${start.getTime()}`,
        title: `${prayerName} • DND On`,
        body: 'Entering silent mode',
        android: {
          channelId,
          pressAction: { id: 'default' },
          actions: [{ title: 'Apply now', pressAction: { id: 'apply' } }],
        },
        data: { kind: 'start', prayerName },
      },
      trigger
    );
  }

  // END
  if (end && end.getTime && end.getTime() > Date.now()) {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: end.getTime(),
      // Wake from Doze
      alarmManager: { allowWhileIdle: true },
    };
    await notifee.createTriggerNotification(
      {
        id: `end-${prayerName}-${end.getTime()}`,
        title: `${prayerName} • DND Off`,
        body: 'Leaving silent mode',
        android: {
          channelId,
          pressAction: { id: 'default' },
          actions: [{ title: 'Apply now', pressAction: { id: 'apply' } }],
        },
        data: { kind: 'end', prayerName },
      },
      trigger
    );
  }
}

export async function cancelAllScheduled() {
  // Cancels both displayed and scheduled (trigger) notifications
  await notifee.cancelAllNotifications();
}
