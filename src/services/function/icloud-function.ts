import { HttpsCallableResult } from '@firebase/functions';

export interface ICloudFunctions {
  call: (name: string, data?: any) => Promise<HttpsCallableResult<unknown>>;
}
