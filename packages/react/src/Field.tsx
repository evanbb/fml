import { FmlFieldConfiguration, FmlFieldConfigurationBase } from '@fml/core';
import {
  FmlFieldControlRegistry,
  FmlRegisteredFieldControls,
} from '@fml/controls';
import { memo } from 'react';
import { FmlComponentProps } from './common/FmlComponent';

import Checkbox from './fields/Checkbox';
import DateComponent from './fields/Date';
import DateTime from './fields/DateTime';
import Hidden from './fields/Hidden';
import NumberComponent from './fields/Number';
import Radios from './fields/Radios';
import Select from './fields/Select';
import Text from './fields/Text';
import TextArea from './fields/TextArea';
import Toggle from './fields/Toggle';

export type FieldMap<TValue> = {
  [Key in FmlRegisteredFieldControls as Capitalize<Key>]: React.ComponentType<
    {
      config: FmlFieldConfiguration<TValue>;
    } & FmlComponentProps<
      FmlFieldControlRegistry<TValue>[Key][0],
      FmlFieldConfiguration<FmlFieldControlRegistry<TValue>[Key][0]>
    >
  >;
};

function getControl<TValue>(
  props: FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>,
): React.ComponentType<
  FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>
> {
  const map: FieldMap<TValue> = {
    Checkbox: Checkbox as any,
    Date: DateComponent as any,
    Datetime: DateTime as any,
    Hidden: Hidden as any,
    Number: NumberComponent as any,
    Radios: Radios as any,
    Select: Select as any,
    Text: Text as any,
    Textarea: TextArea as any,
    Toggle: Toggle as any,
  };

  const { control } = props.config as FmlFieldConfigurationBase<
    unknown,
    FmlRegisteredFieldControls
  >;
  const capitalized = `${control
    .substring(0, 1)
    .toUpperCase()}${control.substring(1)}` as Capitalize<keyof typeof map>;

  const result = map[capitalized];

  return result as unknown as React.ComponentType<
    FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>
  >;
}

function Field<TValue>(
  props: FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>,
) {
  const Ctrl = getControl<TValue>(props);

  return <Ctrl key={props.controlId} {...props} />;
}

export default memo(Field) as unknown as typeof Field;
