import {
  ControlConfigurationBase,
  FieldConfiguration,
  Configuration,
  ListConfiguration,
  ModelConfiguration,
  FmlLayoutConfiguration,
} from '@fml/core';
import { memo } from 'react';
import Layout from '../Layout';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

export function getControlConfig<TValue>(
  config: unknown,
): ControlConfigurationBase<TValue> {
  if (isControlConfig<TValue>(config)) {
    return config;
  }
  if (isLayoutConfig<TValue>(config)) {
    return getControlConfig(
      config[config.length - 1] as Configuration<TValue>,
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
): config is ControlConfigurationBase<TValue> {
  return !isLayoutConfig(config);
}

function isFieldProps<TValue>(
  config: unknown,
): config is FieldConfiguration<TValue> {
  return Boolean((config as FieldConfiguration<TValue>)?.control);
}

function isListProps<TValue>(
  config: unknown,
): config is ListConfiguration<TValue> {
  return Boolean((config as ListConfiguration<TValue>)?.itemConfig);
}

function isModelProps<TValue>(
  config: unknown,
): config is ModelConfiguration<TValue> {
  return Boolean((config as ModelConfiguration<TValue>)?.schema);
}

export interface FmlComponentProps<TValue> {
  config: Configuration<TValue>;
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
