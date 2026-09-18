const DEVICE_KEY = "dramacut:device:v1";

export function getDeviceId(): string {
  try {
    const stored = localStorage.getItem(DEVICE_KEY);
    if (stored) return stored;
    const id = crypto.randomUUID();
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  } catch {
    return "";
  }
}
