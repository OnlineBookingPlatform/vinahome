export const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map((part) => parseInt(part) || 0);
  return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
};

// Chuyển đổi số giây thành chuỗi HH:MM
export const secondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
  ].join(":");
};
export const calculateTotalTime = (time1: string, time2: string): string => {
  const totalSeconds = timeToSeconds(time1) + timeToSeconds(time2);
  return secondsToTime(totalSeconds);
};
export const calculateDuration = (startTime: string, endTime: string): string => {
  const startSec = timeToSeconds(startTime);
  const endSec = timeToSeconds(endTime);

  const durationSec =
    endSec >= startSec ? endSec - startSec : 86400 - startSec + endSec;

  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor((durationSec % 3600) / 60);

  return `${hours}h${minutes.toString().padStart(2, "0")}`;
};
