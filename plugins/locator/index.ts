import { HelloService } from '@/services/HelloService';
import { UtilService } from '@/services/UtilService';
import { ElectronNativeService } from '@/services/native/ElectronNativeService.use';

import Store from './store';

const store = new Store();

export default defineNuxtPlugin(() => {
  return {
    provide: {
      HelloService: store.service('HelloService', () => new HelloService()),
      UtilService: store.service('UtilService', () => new UtilService()),
      NativeService: store.service('NativeService', () => new ElectronNativeService()),
    },
  };
});