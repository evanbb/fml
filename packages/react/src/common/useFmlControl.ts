import {
  FmlControlConfiguration,
  FmlValidatorConfiguration,
  FmlValidityStatus,
  FmlValueState,
  FmlValueStateChangeHandler,
  instantiateValidator,
} from '@fml/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFmlContext } from './FmlControlContext';

export function useFmlControl<Value>(config: FmlControlConfiguration<Value>) {
  const {
    controlId,
    onBlur: contextOnBlur,
    onFocus: contextOnFocus,
    onChange,
  } = useFmlContext();

  const { blurHandler, hasBeenBlurred } = useFmlComponentBlur(contextOnBlur);
  const { currenValue, setCurrenValue } = useFmlComponentState<Value>(
    config.defaultValue as Value,
    (config.validators ?? []) as FmlValidatorConfiguration<Value>[],
  );
  const { focusHandler } = useFmlComponentFocus(contextOnFocus);

  const { validationMessages, changeHandler } = useFmlComponentChange<Value>(
    (config.validators ?? []) as FmlValidatorConfiguration<Value>[],
    onChange,
    currenValue,
    setCurrenValue,
    hasBeenBlurred,
  );

  return {
    controlId,
    changeHandler,
    focusHandler,
    blurHandler,
    value: currenValue.value,
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

function useFmlComponentState<Value>(
  defaultValue: Value,
  validators: FmlValidatorConfiguration<Value>[],
) {
  const [currenValue, setCurrenValue] = useState({
    value: {
      value: defaultValue,
      validity: validators?.length ? 'unknown' : ('valid' as FmlValidityStatus),
    },
    validationMessages: [] as string[],
  });

  return {
    currenValue,
    setCurrenValue,
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

function useFmlComponentChange<Value>(
  validators: FmlValidatorConfiguration<Value>[],
  afterStateChangeHandler: FmlValueStateChangeHandler<Value>,
  componentState: {
    value: FmlValueState<Value>;
    validationMessages: string[];
  },
  setComponentState: React.Dispatch<
    React.SetStateAction<{
      value: FmlValueState<Value>;
      validationMessages: string[];
    }>
  >,
  hasBeenBlurred: boolean,
) {
  const validatorFuncs = useFmlValidators<Value>(validators);

  const { value: stateValue, validationMessages } = componentState;

  const changeHandler = useCallback(
    (change: FmlValueState<Value>) => {
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
    afterStateChangeHandler(stateValue);
  }, [stateValue, afterStateChangeHandler]);

  return { validationMessages, changeHandler };
}

function useFmlValidators<Value>(
  validators: FmlValidatorConfiguration<Value>[],
) {
  return useMemo(
    () =>
      validators
        ? validators.map((validator) =>
            instantiateValidator<Value>(
              validator as FmlValidatorConfiguration<Value> & { args: [] },
            ),
          )
        : [],
    [validators],
  );
}

function usePreviousValue<T>(latesValue: T) {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = latesValue;
  }, [latesValue]);

  return ref.current;
}
