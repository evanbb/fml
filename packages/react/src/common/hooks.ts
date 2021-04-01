import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FmlValidatorConfiguration,
  FmlValueState,
  FmlValueStateChangeHandler,
  createValidator,
} from '@fml/core';
import type { Noop } from '@fml/core';
import { FmlFormComponentProps } from './FmlComponent';

interface UseFmlComponentOutput<TValue> {
  onChange: FmlValueStateChangeHandler<TValue>;
  onFocus: Noop;
  onBlur: Noop;
  value: FmlValueState<TValue>;
  validationMessages: string[];
}

export function useFmlComponent<TValue>(
  props: FmlFormComponentProps<TValue>,
): UseFmlComponentOutput<TValue> {
  const { currentValue, setCurrentValue } = useFmlComponentState<TValue>(props);
  const { focusHandler } = useFmlComponentFocus(props);

  const {
    validationMessages,
    changeHandler,
    doValidation,
  } = useFmlComponentChange(props, currentValue, setCurrentValue);

  const { blurHandler } = useFmlComponentBlur(currentValue, doValidation);

  return {
    onChange: changeHandler,
    onFocus: focusHandler,
    onBlur: blurHandler,
    value: currentValue.value,
    validationMessages,
  };
}

interface UseFmlComponentState<TValue> {
  value: FmlValueState<TValue>;
  validationMessages: string[];
}

function useFmlComponentState<TValue>(props: FmlFormComponentProps<TValue>) {
  const [currentValue, setCurrentValue] = useState<
    UseFmlComponentState<TValue>
  >({
    value: {
      value: props.config.defaultValue as TValue,
      validity: props.config.validators?.length ? 'unknown' : 'valid',
    },
    validationMessages: [],
  });

  return {
    currentValue,
    setCurrentValue,
  };
}

function useFmlComponentFocus<TValue>({
  onFocus,
}: FmlFormComponentProps<TValue>) {
  const [hasBeenTouched, setHasBeenTouched] = useState<boolean>(false);

  const focusHandler = useCallback(() => setHasBeenTouched(true), []);

  // keep parent in sync with whether it has been touched
  useEffect(() => {
    if (hasBeenTouched) {
      onFocus();
    }
  }, [hasBeenTouched, onFocus]);

  return {
    hasBeenTouched,
    focusHandler,
  };
}

function useFmlComponentBlur<TValue>(
  { value }: UseFmlComponentState<TValue>,
  doValidation: (value: FmlValueState<TValue>) => void,
) {
  const [hasBeenBlurred, setHasBeenBlurred] = useState<boolean>(false);

  const blurHandler = useCallback(() => {
    setHasBeenBlurred(true);
  }, [setHasBeenBlurred]);

  // the first time a user blurs but hasn't changed it, trigger validation
  useEffect(() => {
    if (hasBeenBlurred && value.validity === 'unknown') {
      doValidation(value);
    }
  }, [hasBeenBlurred, value, doValidation]);

  return {
    blurHandler,
    hasBeenBlurred,
  };
}

function useFmlComponentValidationPromiseCounter() {
  const numRef = useRef<number>(Number.MIN_SAFE_INTEGER);

  const ref = useRef<{
    current: () => number;
    next: () => number;
  }>({
    current: () => numRef.current,
    next: () => ++numRef.current,
  });

  return ref.current;
}

function useFmlComponentChange<TValue>(
  { onChange, config, controlId }: FmlFormComponentProps<TValue>,
  componentState: UseFmlComponentState<TValue>,
  setComponentState: React.Dispatch<
    React.SetStateAction<UseFmlComponentState<TValue>>
  >,
) {
  const {
    current: getCurrentPromiseReference,
    next: nextPromiseReferenceFactory,
  } = useFmlComponentValidationPromiseCounter();
  const validatorFuncs = useFmlValidators<TValue>(
    config.validators as FmlValidatorConfiguration<TValue>[],
  );

  const { value: stateValue, validationMessages } = componentState;

  const doValidation = useCallback(
    async (valueState: FmlValueState<TValue>) => {
      const newReference = nextPromiseReferenceFactory();

      const validationResults = await Promise.all(
        validatorFuncs.map((validator) => validator(valueState.value)),
      );
      const messages = validationResults.flat().filter(Boolean) as string[];

      // another promise was kicked off before this one resolved - just bail
      if (getCurrentPromiseReference() !== newReference) {
        return;
      }

      setComponentState((state) => {
        return {
          value: {
            ...state.value,
            validity: messages.length ? 'invalid' : 'valid',
          },
          validationMessages: messages,
        };
      });
    },
    [
      getCurrentPromiseReference,
      nextPromiseReferenceFactory,
      setComponentState,
      validatorFuncs,
    ],
  );

  const changeHandler = useCallback(
    (change: FmlValueState<TValue>) => {
      const shouldValidate = change.validity === 'pending';

      setComponentState((state) => ({
        ...state,
        value: change,
      }));

      if (!shouldValidate) {
        return;
      }

      doValidation(change);
    },
    [doValidation, setComponentState],
  );

  // any time value changes, inform parent
  useEffect(() => {
    onChange(stateValue);
  }, [stateValue, onChange]);

  return { validationMessages, changeHandler, doValidation };
}

function useFmlValidators<TValue>(
  validators: FmlValidatorConfiguration<TValue>[],
) {
  return useMemo(
    () =>
      validators
        ? validators.map((validator) =>
            createValidator<TValue>(
              validator as FmlValidatorConfiguration<TValue> & { args: [] },
            ),
          )
        : [],
    [validators],
  );
}
