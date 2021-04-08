import { FmlFormConfiguration, FmlFormControlConfigBase } from './common';

export interface FmlListConfiguration<TValue>
  extends FmlFormControlConfigBase<TValue[]> {
  itemSchema: FmlFormConfiguration<TValue>;
}
