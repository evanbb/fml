import { FmlFieldConfiguration, FmlFieldConfigurationBase } from '@fml/core';
import {
  FmlFieldControlRegistry,
  FmlRegisteredFieldControls,
} from '@fml/controls';
import { memo } from 'react';
import { FmlComponentProps } from './common/FmlComponent';
import { getFieldImplementation } from '@fml/controls';
import './fields/Checkbox'
import './fields/Date'
import './fields/DateTime'
import './fields/Hidden'
import './fields/Number'
import './fields/Radios'
import './fields/Select'
import './fields/Text'
import './fields/TextArea'
import './fields/Toggle'

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
    Checkbox: getFieldImplementation('checkbox') as any,
    Date: getFieldImplementation('date') as any,
    Datetime: getFieldImplementation('datetime') as any,
    Hidden: getFieldImplementation('hidden') as any,
    Number: getFieldImplementation('number') as any,
    Radios: getFieldImplementation('radios') as any,
    Select: getFieldImplementation('select') as any,
    Text: getFieldImplementation('text') as any,
    Textarea: getFieldImplementation('textarea') as any,
    Toggle: getFieldImplementation('toggle') as any,
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
