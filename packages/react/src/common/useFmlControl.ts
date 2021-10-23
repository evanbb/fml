import {
  ControlConfigurationBase,
  ValidatorConfiguration,
  ValidityStatus,
  ValueState,
  ValueStateChangeHandler,
  instantiateValidator,
} from '@fml/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFmlContext } from './FmlControlContext';

export function useFmlControl<Value>(config: ControlConfigurationBase<Value>) {
  const {
    controlId,
    onBlur: contextOnBlur,
    onFocus: contextOnFocus,
    onChange,
  } = useFmlContext();

  const { blurHandler, hasBeenBlurred } = useFmlComponentBlur(contextOnBlur);
  const { currentValue, setCurrentValue } = useFmlComponentState<Value>(
    config.defaultValue as Value,
    (config.validators || []) as ValidatorConfiguration<Value>[],
  );
  const { focusHandler } = useFmlComponentFocus(contextOnFocus);

  const { validationMessages, changeHandler } = useFmlComponentChange<Value>(
    (config.validators || []) as ValidatorConfiguration<Value>[],
    onChange,
    currentValue,
    setCurrentValue,
    hasBeenBlurred,
  );

  return {
    controlId,
    changeHandler,
    focusHandler,
    blurHandler,
    value: currentValue.value,
    validationMessages,
  };
}

function useFmlComponentBlur(contextOnBlur: () => void) {
  const [hasBeenBlurred, setHasBeenBlurred] = useState<boolean>(false);

  const blurHandler = useCallback(() => {
    setHasBeenBlurred(true);
    contextOnBlur();
  }, [contextOnBlur]);

  return {
    blurHandler,
    hasBeenBlurred,
  };
}

function useFmlComponentState<TValue>(
  defaultValue: TValue,
  validators: ValidatorConfiguration<TValue>[],
) {
  const [currentValue, setCurrentValue] = useState({
    value: {
      value: defaultValue,
      validity: validators?.length ? 'unknown' : ('valid' as ValidityStatus),
    },
    validationMessages: [] as string[],
  });

  return {
    currentValue,
    setCurrentValue,
  };
}

function useFmlComponentFocus(onFocus: () => void) {
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

function useFmlComponentChange<TValue>(
  validators: ValidatorConfiguration<TValue>[],
  afterStateChangeHandler: ValueStateChangeHandler<TValue>,
  componentState: {
    value: ValueState<TValue>;
    validationMessages: string[];
  },
  setComponentState: React.Dispatch<
    React.SetStateAction<{
      value: ValueState<TValue>;
      validationMessages: string[];
    }>
  >,
  hasBeenBlurred: boolean,
) {
  const validatorFuncs = useFmlValidators<TValue>(validators);
  const { controlId } = useFmlContext();

  const { value: stateValue, validationMessages } = componentState;

  const changeHandler = useCallback(
    (change: ValueState<TValue>) => {
      console.log(
        `setting internal state of ${controlId} from change: `,
        change,
      );
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
      console.log(`validating value of ${controlId}:`, stateValue);
      const validationResults = await Promise.all(
        validatorFuncs.map((validator) => validator(stateValue.value)),
      );
      const messages = validationResults.flat().filter(Boolean) as string[];

      console.log(`done validating value for ${controlId}:`, stateValue.value);
      console.log('in flight:', inflight);

      // another promise was kicked off before this one resolved - just bail
      if (!inflight) {
        return;
      }

      setComponentState((state) => {
        console.log(
          `setting internal state for ${controlId} based on validity:`,
          messages.length ? 'invalid' : 'valid',
        );
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
      console.log(
        `validity is ${stateValue.validity} and state changed is ${stateChanged} for ${controlId}`,
      );
      validate();
    } else if (firstTimeBlurring) {
      // fire validation the first time the user blurs from the field
      console.log(`this is the first time blurring from ${controlId}`);
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
    console.log(
      `informing parent of ${controlId} that a state change occurred`,
      stateValue,
    );
    afterStateChangeHandler(stateValue);
  }, [stateValue, afterStateChangeHandler]);

  return { validationMessages, changeHandler };
}

function useFmlValidators<TValue>(
  validators: ValidatorConfiguration<TValue>[],
) {
  return useMemo(
    () =>
      validators
        ? validators.map((validator) =>
            instantiateValidator<TValue>(
              validator as ValidatorConfiguration<TValue> & { args: [] },
            ),
          )
        : [],
    [validators],
  );
}

function usePreviousValue<T>(latestValue: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = latestValue;
  }, [latestValue]);

  return ref.current;
}
