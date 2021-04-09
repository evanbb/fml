import { FmlComponentProps } from '../common/FmlComponent';
import RADIOS from '@fml/core/controls/add/radios';
import { register } from '@fml/core/controls';

type RadiosProps = FmlComponentProps<string>;

export default function Radios(props: RadiosProps) {
  return null;
}

register(RADIOS, Radios);
