import { FmlConfiguration, FmlControlClassification, FmlControlClassifications, FmlFieldControlsFor, FmlRegisteredFieldControls, FmlValidityStatus } from '../index'
import { createFieldStateFromConfig, isFieldConfig } from './FieldState'
import { createModelStateFromConfig, isModelConfig } from './ModelState'
import { createListStateFromConfig, isListConfig } from './ListState'

export interface FormNodeStateBase {
  label: string
  isDirty: boolean,
  isTouched: boolean,
  isValid: boolean,
  validationMessages: string[],
  validity: FmlValidityStatus,
}

interface FieldFormState<Value> extends FormNodeStateBase {
  control: FmlRegisteredFieldControls & FmlFieldControlsFor<Value>
}

interface ModelFormState<Value> extends FormNodeStateBase {
  schema: {
    [K in keyof Value]: FormNodeState<Value[K]>
  }
}

interface ListFormState<Value> extends FormNodeStateBase {
  items: FormNodeState<Value>[]
}

export type FormNodeState<Value> = FormNodeStateBase & (
  FmlControlClassification<Value> extends 'model' ? ModelFormState<Value>
  : FmlControlClassification<Value> extends 'list' ? ListFormState<Value>
  : FieldFormState<Value>)


interface FieldFormBindings<Value> {
  setValue(value: Value): void
  onFocus(): void
  onBlur(): void
}

interface ModelFormBindings<Value> {
  schema: {
    [K in keyof Value]: FormNodeBindings<Value[K]>
  }
}

interface ListFormBindings<Value> {
  addItem(): void,
  removeItem(index: number): void
  keyOf(index: number): string
  items: FormNodeBindings<Value>[]
}

export type FormNodeBindings<Value> = (
  FmlControlClassification<Value> extends 'model' ? ModelFormBindings<Value>
  : FmlControlClassification<Value> extends 'list' ? ListFormBindings<Value>
  : FieldFormBindings<Value>)

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

export interface FmlFormState<Value, State = FormNodeState<Value>, Bindings = FormNodeBindings<Value>> {
  value: Value,
  state: State
  bindings: Bindings
}

export type FmlFormStateClassification<Value, Classification extends FmlControlClassifications> =
  Classification extends 'field' ? FmlFormState<Value, FieldFormState<Value>, FieldFormBindings<Value>>
  : Classification extends 'model' ? FmlFormState<Value, ModelFormState<Value>, ModelFormBindings<Value>>
  : FmlFormState<Value[], ListFormState<Value>, ListFormBindings<Value>>

export function createStateFromConfig<Value>(
  config: FmlConfiguration<Value>,
  onChange: FmlFormStateChangeHandler<Value>
): FmlFormState<Value> {
  if (isModelConfig(config)) {
    return createModelStateFromConfig(config as FmlConfiguration<object>, onChange as never) as unknown as FmlFormState<Value>
  }
  if (isListConfig(config)) {
    return createListStateFromConfig(config, onChange as never) as unknown as FmlFormState<Value>
  }
  if (isFieldConfig(config)) {
    return createFieldStateFromConfig(config, onChange as never) as unknown as FmlFormState<Value>
  }

  throw new Error('unsupported configuration')
}

export function isFieldState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'field'>): state is FmlFormStateClassification<Value, 'field'> {
  return Boolean((state as FmlFormStateClassification<Value, 'field'>).state.control)
}

export function isModelState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'model'>): state is FmlFormStateClassification<Value, 'model'> {
  return Boolean((state as FmlFormStateClassification<Value, 'model'>).state.schema)
}

export function isListState<Value>(state: FmlFormState<Value> | FmlFormStateClassification<Value, 'list'>): state is FmlFormStateClassification<Value, 'list'> {
  return Boolean((state as FmlFormStateClassification<Value, 'list'>).state.items)
}
