import { FmlConfiguration, FmlControlValidatorReturnTypes, FmlModelConfiguration, FmlValidityStatus } from '../index';
import { createStateFromConfig, FmlFormState, FmlFormStateChangeHandler, FmlFormStateChangeInfo } from './FormState';
import { instantiateValidator } from './Validators';


export interface ModelStateApi<Value> {
  fmlType: 'model'
  initialValue: Value | {}
  initialValidity: FmlValidityStatus
  setPropertyValue: <Property extends keyof Value>(property: Property, propertyValue: Value[Property]) => void
}

const MODEL_PROPERTY_SYMBOL: unique symbol = Symbol()

interface ModelPropertyState<Value> {
  state: FmlFormState<Value>
}

type ModelProperty<Value> = Value & {
  [MODEL_PROPERTY_SYMBOL]: ModelPropertyState<Value>
}

type Model<Value> = Value & {
  [K in keyof Value]: ModelProperty<Value[K]>
}

interface OnChangeFactory<Value> {
  <Property extends keyof Value>(prop: Property): FmlFormStateChangeHandler<Value[Property]>
}


function makeStatefulObject<Value>(model: Value, config: FmlModelConfiguration<Value>, onChangeFactory: OnChangeFactory<Value>) {
  type Property = keyof Value;
  for (const property of Object.keys(config.schema as {})) {
    const prop = property as Property
    const state = createStateFromConfig(config.schema[prop] as FmlConfiguration<Value[Property]>, onChangeFactory(prop));

    // todo: fix this typing mess...
    model[prop] = Object.assign(state.initialValue as {}, { [MODEL_PROPERTY_SYMBOL]: state }) as any
  }

  return model as Model<Value>;
}

export function createModelStateFromConfig<Value>(config: FmlModelConfiguration<Value>,
  handleChange: FmlFormStateChangeHandler<Value>
): ModelStateApi<Value> {
  const propertyValidities = {} as Record<keyof Value, FmlValidityStatus>
  let value: Model<Value> = makeStatefulObject((config.defaultValue || {} as Value), config, (prop) => (change: FmlFormStateChangeInfo<Value[keyof Value]>) => {
    isDirty = true
    isTouched = true
    propertyValidities[prop] = change.validity
    setPropertyValue(prop, change.value)
  })
  let isDirty = false
  let isTouched = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]>


  const validators = (config.validators || []).map(instantiateValidator)
  const shouldValidate = Boolean(validators.length)

  function currentValidityStatus(): FmlValidityStatus {
    if (!isTouched) {
      return 'unknown'
    }

    if (isValidating) {
      return 'pending'
    }

    if (validationMessages.length) {
      return 'invalid'
    }

    return 'valid'
  }

  function isCurrentlyValid() {
    return currentValidityStatus() === 'valid'
  }

  function setPropertyValue<Property extends keyof Value>(property: Property, propertyValue: Value[Property]) {
    const state = value[property][MODEL_PROPERTY_SYMBOL];
    (value as any)[property] = Object.assign(propertyValue as {}, { [MODEL_PROPERTY_SYMBOL]: state })
    validateCurrentValue(() => { isDirty = true; isTouched = true; })
  }

  async function validateCurrentValue(preMutation: () => void = () => { }) {
    preMutation()

    isValidating = shouldValidate

    notifyChange()

    if (!isValidating) {
      return
    }

    const validationPromises = validators.map(validator => validator(value!))

    currentValidationPromise = Promise.all(validationPromises)

    const thisValidationPromise = currentValidationPromise

    const results = await thisValidationPromise

    // if another validation was kicked off while this one was running, bail
    if (thisValidationPromise !== currentValidationPromise) {
      return
    }

    validationMessages = results.filter(Boolean).flat() as string[]

    isValidating = false

    notifyChange()
  }

  function notifyChange() {
    handleChange({
      value,
      validationMessages,
      validity: currentValidityStatus(),
      isValid: isCurrentlyValid(),
      isDirty,
      isTouched,
    })
  }

  return {
    fmlType: 'model',
    initialValue: value,
    initialValidity: currentValidityStatus(),
    setPropertyValue
  }
}

export function isModelConfig<Value>(config: FmlConfiguration<Value> | FmlModelConfiguration<Value>): config is FmlModelConfiguration<Value> {
  return Boolean((config as FmlModelConfiguration<Value>).schema);
}
