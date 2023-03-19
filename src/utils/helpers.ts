export const formatTime = (time: string) => {
  const timeFromNowInMs = +new Date(time) - Date.now();
  const timeFromNowInMinutes = Math.round(timeFromNowInMs / 1000 / 60);

  return new Intl.RelativeTimeFormat('en-US', { numeric: 'auto', style: 'long' }).format(
    timeFromNowInMinutes,
    'minutes'
  );
};

export const notificationSound = new Audio('https://static.videosdk.live/prebuilt/notification.mp3');
