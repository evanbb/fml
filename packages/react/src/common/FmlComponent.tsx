import {
  FmlControlConfigurationBase,
  FmlFieldConfiguration,
  FmlConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
} from '@fml/core';
import { memo } from 'react';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

export function getControlConfig<TValue>(
  config: unknown,
): FmlControlConfigurationBase<TValue> {
  if (isControlConfig<TValue>(config)) {
    return config;
  }

  throw new Error('Unrecognized FmlConfiguration object');
}

function isControlConfig<TValue>(
  config: unknown,
): config is FmlControlConfigurationBase<TValue> {
  return !Array.isArray(config);
}

function isFieldProps<TValue>(
  config: unknown,
): config is FmlFieldConfiguration<TValue> {
  return Boolean((config as FmlFieldConfiguration<TValue>)?.control);
}

function isListProps<TValue>(
  config: unknown,
): config is FmlListConfiguration<TValue> {
  return Boolean((config as FmlListConfiguration<TValue>)?.itemConfig);
}

function isModelProps<TValue>(
  config: unknown,
): config is FmlModelConfiguration<TValue> {
  return Boolean((config as FmlModelConfiguration<TValue>)?.schema);
}

export interface FmlComponentProps<TValue> {
  config: FmlConfiguration<TValue>;
}

function FmlComponent<TValue>(props: FmlComponentProps<TValue>) {
  return isFieldProps<TValue>(props.config) ? (
    <Field<TValue> {...{ config: props.config }} />
  ) : isListProps<TValue>(props.config) ? (
    <List<TValue> {...{ config: props.config }} />
  ) : isModelProps<TValue>(props.config) ? (
    <Model<TValue> {...{ config: props.config }} />
  ) : null;
}

export default memo(FmlComponent) as typeof FmlComponent;
