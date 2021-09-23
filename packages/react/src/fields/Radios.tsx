import { FmlComponentProps } from '../common/FmlComponent';
import RADIOS from '@fml/add/controls/radios';
import { registerComponent } from '@fml/core';

type RadiosProps = FmlComponentProps<'fml:radios'>;

export default function Radios(props: RadiosProps) {
  return null;
}

registerComponent(RADIOS, Radios);
