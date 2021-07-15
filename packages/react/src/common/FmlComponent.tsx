import {
  FmlFieldConfiguration,
  FmlConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
  FmlValueStateChangeHandler,
  FmlFieldConfigurationBase,
  FmlControlConfiguration,
  FmlLayoutConfiguration,
} from '@fml/core';
import { memo } from 'react';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

export function getControlConfig<TValue>(
  config: FmlConfiguration<TValue>,
): FmlControlConfiguration<TValue> {
  if (isControlConfig(config)) {
    return config;
  }
  if (isLayoutConfig(config)) {
    return getControlConfig(
      config[config.length - 1] as FmlLayoutConfiguration<TValue>,
    );
  }

  throw new Error('Unrecognized FmlConfiguration object');
}

function isLayoutConfig<TValue>(
  config: FmlConfiguration<TValue>,
): config is FmlLayoutConfiguration<TValue> {
  return Array.isArray(config);
}

function isControlConfig<TValue>(
  config: FmlConfiguration<TValue>,
): config is FmlControlConfiguration<TValue> {
  return !isLayoutConfig(config);
}

function isFieldProps<TValue>(
  config: unknown,
): config is FmlComponentProps<TValue, FmlFieldConfiguration<TValue>> {
  return Boolean(
    ((config as FmlComponentProps<TValue, FmlFieldConfiguration<TValue>>)
      ?.config as FmlFieldConfigurationBase<TValue, never>)?.control,
  );
}

function isListProps<TValue>(
  props: unknown,
): props is FmlComponentProps<TValue[], FmlListConfiguration<TValue>> {
  return Boolean(
    (props as FmlComponentProps<TValue[], FmlListConfiguration<TValue>>)?.config
      ?.itemConfig,
  );
}

function isModelProps<TValue>(
  config: unknown,
): config is FmlComponentProps<TValue, FmlModelConfiguration<TValue>> {
  return Boolean(
    (config as FmlComponentProps<TValue, FmlModelConfiguration<TValue>>)?.config
      ?.schema,
  );
}

export interface FmlComponentProps<TValue, TConfigurationType> {
  config: TConfigurationType;
  onFocus: () => void;
  onChange: FmlValueStateChangeHandler<TValue>;
  controlId: string;
}

export interface FmlFormComponentProps<TValue>
  extends FmlComponentProps<TValue, FmlConfiguration<TValue>> {}

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
