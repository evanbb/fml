import { FmlConfiguration, FmlControlClassification, FmlValidityStatus } from '../index'
import { createFieldStateFromConfig, FieldStateApi, isFieldConfig } from './FieldState'
import { createModelStateFromConfig, isModelConfig, ModelStateApi } from './ModelState'
import { createListStateFromConfig, isListConfig, ListStateApi } from './ListState'

export type FmlFormState<Value> =
  FmlControlClassification<Value> extends 'control'
    ? FieldStateApi<Value>
    : FmlControlClassification<Value> extends 'list'
      ? ListStateApi<Value>
      : ModelStateApi<Value>

export interface FmlFormStateChangeInfo<Value> {
  value: Value
  validity: FmlValidityStatus
  validationMessages: string[]
  isValid: boolean
  isDirty: boolean
  isTouched: boolean
}

export interface FmlFormStateChangeHandler<Value> {
  (change: FmlFormStateChangeInfo<Value>): void
}

export function createStateFromConfig<Value>(
  config: FmlConfiguration<Value>,
  onChange: FmlFormStateChangeHandler<Value>
) {
  if (isModelConfig(config)) {
    return createModelStateFromConfig(config, onChange)
  }
  if (isListConfig(config)) {
    return createListStateFromConfig(config, onChange as any)
  }
  if (isFieldConfig(config)) {
    return createFieldStateFromConfig(config, onChange)
  }

  throw new Error('unsupported configuration')
}
