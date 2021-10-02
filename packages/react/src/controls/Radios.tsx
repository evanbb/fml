import { FmlComponentProps } from '../common/FmlComponent';
import { registerComponent } from '@fml/core';

const RADIOS = 'fml:radios'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [RADIOS]: [
      StringUnionOnlyNotString<Value>,
      [Value] extends [string]
        ? string extends Value
          ? never
          : OptionsListConfiguration<Value>
        : never,
    ];
  }
}

type RadiosProps = FmlComponentProps<typeof RADIOS>;

export default function Radios(props: RadiosProps) {
  return null;
}

registerComponent(RADIOS, Radios);
