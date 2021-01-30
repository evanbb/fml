import {
  FieldConfiguration,
  FormConfig,
  ListConfiguration,
  ModelConfiguration,
} from '@evanbb/fml-core';
import Field from '../Field';
import List from '../List';
import Model from '../Model';

function isFieldConfig<TValue>(config): config is FieldConfiguration<TValue> {
  return !!(config as FieldConfiguration<TValue>).control;
}

function isListConfig<TValue>(config): config is ListConfiguration<TValue> {
  return !!(config as ListConfiguration<TValue>).itemSchema;
}

function isModelConfig<TValue>(config): config is ModelConfiguration<TValue> {
  return !!(config as ModelConfiguration<TValue>).schema;
}

interface FmlComponentProps<TValue> {
  config: FormConfig<TValue>;
}

export default function FmlComponent<TValue>({
  config,
}: FmlComponentProps<TValue>) {
  return isFieldConfig(config) ? (
    <Field config={config} />
  ) : isListConfig(config) ? (
    <List config={config} />
  ) : isModelConfig(config) ? (
    <Model config={config} />
  ) : null;
}
