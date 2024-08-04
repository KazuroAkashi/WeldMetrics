import { defineStore } from 'pinia';

export enum NotificationType {
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}
export type NotificationObject = {
  text: string;
  type: NotificationType;
  ms: number;
};

export const useNotificationStore = defineStore('notifications', {
  state: () => ({
    notifs: [] as NotificationObject[],
    buffer: [] as (NotificationObject & { id: number })[],
    newId: 0,
    timeouts: [] as { timeout: NodeJS.Timeout; id: number }[],
  }),
  actions: {
    send(
      text: string,
      type: NotificationType = NotificationType.INFO,
      ms: number = 3000,
    ) {
      this.notifs.push({ text, type, ms });

      const idnow = this.newId;
      this.buffer.push({ id: idnow, text, type, ms });

      const timeout = setTimeout(() => {
        this.buffer.splice(
          this.buffer.findIndex((obj) => obj.id === idnow),
          1,
        );
      }, ms);

      this.timeouts.push({ id: idnow, timeout });

      this.newId++;
    },

    deleteFromBuffer(id: number) {
      this.buffer.splice(
        this.buffer.findIndex((obj) => obj.id === id),
        1,
      );
      const timeout = this.timeouts.splice(
        this.timeouts.findIndex((obj) => obj.id === id),
        1,
      );
      clearTimeout(timeout[0].timeout);
    },
  },
});
