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

export function getControlConfig<Value>(
  config: unknown,
): FmlControlConfigurationBase<Value> {
  if (isControlConfig<Value>(config)) {
    return config;
  }

  throw new Error('Unrecognized FmlConfiguration object');
}

function isControlConfig<Value>(
  config: unknown,
): config is FmlControlConfigurationBase<Value> {
  return !Array.isArray(config);
}

function isFieldProps<Value>(
  config: unknown,
): config is FmlFieldConfiguration<Value> {
  return Boolean((config as FmlFieldConfiguration<Value>)?.control);
}

function isListProps<Value>(
  config: unknown,
): config is FmlListConfiguration<Value> {
  return Boolean((config as FmlListConfiguration<Value>)?.itemConfig);
}

function isModelProps<Value>(
  config: unknown,
): config is FmlModelConfiguration<Value> {
  return Boolean((config as FmlModelConfiguration<Value>)?.schema);
}

export interface FmlComponentProps<Value> {
  config: FmlConfiguration<Value>;
}

function FmlComponent<Value>(props: FmlComponentProps<Value>) {
  return isFieldProps<Value>(props.config) ? (
    <Field<Value> {...{ config: props.config }} />
  ) : isListProps<Value>(props.config) ? (
    <List<Value> {...{ config: props.config }} />
  ) : isModelProps<Value>(props.config) ? (
    <Model<Value> {...{ config: props.config }} />
  ) : null;
}

export default memo(FmlComponent) as typeof FmlComponent;
