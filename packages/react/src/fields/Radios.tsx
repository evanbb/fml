import { FmlComponentProps } from '../common/FmlComponent';
import RADIOS from '@fml/add/controls/radios';
import { registerControl } from '@fml/core';

type RadiosProps = FmlComponentProps<string>;

export default function Radios(props: RadiosProps) {
  return null;
}

registerControl(RADIOS, Radios);
