import { FmlConfiguration, FmlControlValidatorReturnTypes, FmlListConfiguration, FmlValidityStatus } from '../index';
import { createStateFromConfig, FmlFormState, FmlFormStateChangeHandler } from './FormState';
import { isModelConfig } from './ModelState';
import { instantiateValidator } from './Validators';

function listIdFactoryFactory() {
  let LIST_ITEM_IDENTITY = 0//Number.MIN_SAFE_INTEGER

  return function getNextListItemId(): number {
    return ++LIST_ITEM_IDENTITY;
  }
}

export interface ListStateApi<Value> {
  fmlType: 'list'
  initialValue: Value[]
  initialValidity: FmlValidityStatus
  addItem: () => void
  removeItem: (id: number) => void
  listItemState: (value: Value) => ListItemState<Value>
}

const LIST_ITEM_SYMBOL: unique symbol = Symbol()

interface ListItemState<Value> {
  id: number,
  state: FmlFormState<Value>
}

type ListItem<Value> = Value & {
  [LIST_ITEM_SYMBOL]: ListItemState<Value>
}

export function createListStateFromConfig<Value>(
  config: FmlListConfiguration<Value>,
  handleChange: FmlFormStateChangeHandler<Value[]>
): ListStateApi<Value> {
  const listIdFactory = listIdFactoryFactory()
  let value: ListItem<Value>[] = (config.defaultValue || []).map(createStatefulItem)
  let isDirty = false
  let isTouched = false
  let isValidating = false
  let validationMessages: string[] = []
  let currentValidationPromise: Promise<FmlControlValidatorReturnTypes[]>

  const itemValidities = value.reduce((result, item) => {
    const itemState = item[LIST_ITEM_SYMBOL]
    result[itemState.id] = itemState.state.initialValidity
    return result
  }, {} as Record<number, FmlValidityStatus>);

  const validators = (config.validators || []).map(instantiateValidator)
  const shouldValidate = Boolean(validators.length)

  function createStatefulItem(value: Value): ListItem<Value> {
    const id = listIdFactory()
    const newConfig: FmlConfiguration<Value> = {
      ...config.itemConfig,
      defaultValue: value
    }

    const api = {
      id,
      state: createStateFromConfig<Value>(newConfig, change => {
        isDirty = true;
        isTouched = true;
        itemValidities[id] = change.validity
        updateItem(id, change.value)
      })
    }

    return Object.assign(value as any, { [LIST_ITEM_SYMBOL]: api });
  }

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

    const validities = new Set<FmlValidityStatus>(
      Object.values(itemValidities)
    );

    return validities.has('invalid')
      ? 'invalid'
      : validities.has('unknown') || validities.has('pending')
        ? 'unknown'
        : 'valid'
  }

  function isCurrentlyValid() {
    return currentValidityStatus() === 'valid'
  }

  function addItem() {
    value.push(createStatefulItem(sensibleDefault(config.itemConfig) as Value))

    validateCurrentValue(() => { isDirty = true; isTouched = true; })
  }

  function removeItem(id: number) {
    const index = value.findIndex(item => item[LIST_ITEM_SYMBOL].id === id)
    if (index === -1) {
      return
    }

    value.splice(index, 1)

    validateCurrentValue(() => { isDirty = true; isTouched = true; })
  }

  function updateItem(id: number, newValue: Value) {
    const index = value.findIndex(item => item[LIST_ITEM_SYMBOL].id === id)
    if (index === -1) {
      return
    }

    const state = value[index][LIST_ITEM_SYMBOL]
    const newItem = Object.assign(newValue as any, state)
    value.splice(index, 1, newItem)

    validateCurrentValue(() => { isDirty = true })
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

  function listItemState(item: Value) {
    const identifiable = item as ListItem<Value>
    const result = value.find(x => x[LIST_ITEM_SYMBOL] === identifiable[LIST_ITEM_SYMBOL])
    if (!result) {
      throw new Error('ITEM NOT FOUND IN LIST WHAT DO WE DO?!?!?!?!')
    }
    return result[LIST_ITEM_SYMBOL]
  }

  return {
    fmlType: 'list',
    initialValue: value,
    initialValidity: currentValidityStatus(),
    addItem,
    removeItem,
    listItemState
  }
}

export function isListConfig<Value>(config: FmlConfiguration<Value> | FmlListConfiguration<Value>): config is FmlListConfiguration<Value> {
  return Boolean((config as FmlListConfiguration<Value>).itemConfig);
}

function sensibleDefault<Value>(config: FmlConfiguration<Value>) {
  if (isListConfig(config)) {
    return config.defaultValue || []
  }
  if (isModelConfig(config)) {
    return config.defaultValue || {}
  }

  // field configs require a defaultValue, so this will always have *something*
  return config.defaultValue
}
