import { FmlFormConfiguration, FmlFormControlConfigBase } from './common';

export interface FmlModelConfiguration<TValue>
  extends FmlFormControlConfigBase<TValue> {
  schema: { [Key in keyof TValue]: FmlFormConfiguration<TValue[Key]> };
}
