import notifee, { AndroidImportance, TriggerType } from '@notifee/react-native';

async function ensureChannel() {
  return await notifee.createChannel({
    id: 'namazmode',
    name: 'Namaz Mode',
    importance: AndroidImportance.HIGH,
  });
}

export async function scheduleNotification(
  prayerName,
  time,
  kind,
  isPre = false,
) {
  if (!time || !time.getTime || time.getTime() <= Date.now()) return;

  const channelId = await ensureChannel();

  await notifee.createTriggerNotification(
    {
      id: `${kind}-${prayerName}-${time.getTime()}`,
      title: isPre
        ? `${prayerName} • Silent Mode Soon`
        : `${prayerName} • ${kind === 'start' ? 'DND ON' : 'DND OFF'}`,
      body: isPre
        ? 'Your phone will go silent in 5 minutes'
        : kind === 'start'
        ? 'Namaz started. DND ON'
        : 'Namaz completed. DND OFF',
      android: {
        channelId,
        timeoutAfter: isPre ? 5 * 60 * 1000 : 1 * 60 * 1000,
        pressAction: { id: 'default' },
        importance: AndroidImportance.HIGH,
      },
      data: { kind, prayerName },
    },
    {
      type: TriggerType.TIMESTAMP,
      timestamp: time.getTime(),
      alarmManager: { allowWhileIdle: true },
    },
  );
}

export async function scheduleStartEnd(prayerName, start, end) {
  if (start) {
    const preStartTime = new Date(start.getTime() - 5 * 60 * 1000);
    await scheduleNotification(prayerName, preStartTime, 'pre-start', true);
    await scheduleNotification(prayerName, start, 'start');
  }

  if (end) {
    await scheduleNotification(prayerName, end, 'end');
  }
}

export async function cancelAllScheduled() {
  await notifee.cancelAllNotifications();
}
