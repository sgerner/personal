import { writable } from 'svelte/store';

export const status = writable({ visible: false, message: '', kind: 'success' });

let hideTimer;

export function flash(message, kind = 'success', duration = 2000) {
  status.set({ visible: true, message, kind });
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    status.update((s) => ({ ...s, visible: false }));
  }, duration);
}

export function hide() {
  if (hideTimer) clearTimeout(hideTimer);
  status.update((s) => ({ ...s, visible: false }));
}
