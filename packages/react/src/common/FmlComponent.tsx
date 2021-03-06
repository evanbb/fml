import {
  FmlFieldConfiguration,
  FmlFormConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
  FmlValueStateChangeHandler,
  Noop,
} from '@fml/core';
import { memo } from 'react';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

function isFieldProps<TValue>(
  config: unknown,
): config is FmlComponentProps<TValue, FmlFieldConfiguration<TValue>> {
  return Boolean(
    (config as FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>).config
      .control,
  );
}

function isListProps<TValue>(
  props: unknown,
): props is FmlComponentProps<TValue[], FmlListConfiguration<TValue>> {
  return Boolean(
    (props as FmlComponentProps<TValue[], FmlListConfiguration<TValue>>).config
      .itemSchema,
  );
}

function isModelProps<TValue>(
  config: unknown,
): config is FmlComponentProps<TValue, FmlModelConfiguration<TValue>> {
  return Boolean(
    (config as FmlComponentProps<TValue, FmlModelConfiguration<TValue>>).config
      .schema,
  );
}

export interface FmlComponentProps<TValue, TConfigurationType> {
  config: TConfigurationType;
  onFocus: Noop;
  onChange: FmlValueStateChangeHandler<TValue>;
  controlId: string;
}

export interface FmlFormComponentProps<TValue>
  extends FmlComponentProps<TValue, FmlFormConfiguration<TValue>> {}

function FmlComponent<TValue, TConfigurationType>(
  props: FmlComponentProps<TValue, TConfigurationType>,
) {
  return isFieldProps<TValue>(props) ? (
    <Field {...props} />
  ) : isListProps<TValue>(props) ? (
    <List {...props} />
  ) : isModelProps<TValue>(props) ? (
    <Model {...props} />
  ) : null;
}

export default memo(FmlComponent) as typeof FmlComponent;
