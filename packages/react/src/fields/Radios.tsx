import { FmlFieldConfiguration } from '@fml/core';
import ValidationMessages from '../ValidationMessages';
import { useFmlComponent } from '../common/hooks';
import { FmlComponentProps } from '../common/FmlComponent';
import { register } from '@fml/controls';

type RadiosProps = FmlComponentProps<string, FmlFieldConfiguration<string>>;

export default function Radios(props: RadiosProps) {
  return null;
}

register('radios', Radios);
