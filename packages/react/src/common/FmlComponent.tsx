import {
  FmlControlConfigurationBase,
  FmlFieldConfiguration,
  FmlConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
  FmlLayoutConfiguration,
} from '@fml/core';
import { memo } from 'react';
import Layout from '../Layout';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

export function getControlConfig<TValue>(
  config: unknown,
): FmlControlConfigurationBase<TValue> {
  if (isControlConfig<TValue>(config)) {
    return config;
  }
  if (isLayoutConfig<TValue>(config)) {
    return getControlConfig(
      config[config.length - 1] as FmlConfiguration<TValue>,
    );
  }

  throw new Error('Unrecognized FmlConfiguration object');
}

function isLayoutConfig<TValue>(
  config: unknown,
): config is FmlLayoutConfiguration<TValue> {
  return Array.isArray(config);
}

function isControlConfig<TValue>(
  config: unknown,
): config is FmlControlConfigurationBase<TValue> {
  return !isLayoutConfig(config);
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
  ) : isLayoutConfig(props.config) ? (
    <Layout<TValue>
      // todo: figure out why this cast is necessary...
      {...{ config: props.config as FmlLayoutConfiguration<TValue> }}
    />
  ) : null;
}

export default memo(FmlComponent) as typeof FmlComponent;
