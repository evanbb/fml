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
  hasBeenTouched: boolean;
  onBlur: Noop;
  value: FmlValueState<TValue>;
  validationMessages: string[];
}

export function useFmlComponent<TValue>(
  props: FmlFormComponentProps<TValue>,
): UseFmlComponentOutput<TValue> {
  const { blurHandler, hasBeenBlurred } = useFmlComponentBlur();
  const { currentValue, setCurrentValue } = useFmlComponentState<TValue>(props);
  const { focusHandler, hasBeenTouched } = useFmlComponentFocus(props);

  const { validationMessages, changeHandler } = useFmlComponentChange(
    props,
    currentValue,
    setCurrentValue,
    hasBeenBlurred,
  );

  return {
    hasBeenTouched,
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

function useFmlComponentBlur() {
  const [hasBeenBlurred, setHasBeenBlurred] = useState<boolean>(false);

  const blurHandler = useCallback(() => {
    setHasBeenBlurred(true);
  }, []);

  return {
    blurHandler,
    hasBeenBlurred,
  };
}

function usePreviousValue<T>(latestValue: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = latestValue;
  }, [latestValue]);

  return ref.current;
}

function useFmlComponentChange<TValue>(
  { onChange, config }: FmlFormComponentProps<TValue>,
  componentState: UseFmlComponentState<TValue>,
  setComponentState: React.Dispatch<
    React.SetStateAction<UseFmlComponentState<TValue>>
  >,
  hasBeenBlurred: boolean,
) {
  const validatorFuncs = useFmlValidators<TValue>(
    config.validators as FmlValidatorConfiguration<TValue>[],
  );

  const { value: stateValue, validationMessages } = componentState;

  const changeHandler = useCallback(
    (change: FmlValueState<TValue>) => {
      setComponentState((state) => ({
        ...state,
        value: change,
      }));
    },
    [setComponentState],
  );

  const wasAlreadyBlurred = usePreviousValue(hasBeenBlurred);
  const firstTimeBlurring = hasBeenBlurred && !wasAlreadyBlurred;

  const previousStateValue = usePreviousValue(stateValue.value);
  const stateChanged = previousStateValue !== stateValue.value;

  useEffect(() => {
    let inflight = true;

    async function validate() {
      const validationResults = await Promise.all(
        validatorFuncs.map((validator) => validator(stateValue.value)),
      );
      const messages = validationResults.flat().filter(Boolean) as string[];

      // another promise was kicked off before this one resolved - just bail
      if (!inflight) {
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
    }

    if (stateValue.validity === 'pending' && stateChanged) {
      validate();
    } else if (firstTimeBlurring) {
      // fire validation the first time the user blurs from the field
      validate();
    }

    return () => {
      inflight = false;
    };
  }, [
    stateChanged,
    firstTimeBlurring,
    stateValue,
    validatorFuncs,
    setComponentState,
  ]);

  // any time value changes, inform parent
  useEffect(() => {
    onChange(stateValue);
  }, [stateValue, onChange]);

  return { validationMessages, changeHandler };
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
