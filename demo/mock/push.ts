// Notifiche finte per la demo: nel browser non arrivano.
export async function registerForPush() { return null; }
export function onNotificationOpen(_cb: (data: any) => void): () => void { return () => {}; }
