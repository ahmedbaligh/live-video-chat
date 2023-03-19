export const setMeetingQuality = (participant?: { setQuality: Function }, quality = 'high') => {
  participant?.setQuality(quality);
};

export const handleMeetingError = (error?: { code: number; message: string }) => {
  const isServerError = `${error?.code}`.startsWith('500');

  const errorSoundNotification = new Audio(
    isServerError
      ? `https://static.videosdk.live/prebuilt/notification_critical_err.mp3`
      : `https://static.videosdk.live/prebuilt/notification_err.mp3`
  );
  errorSoundNotification.play();
};
