import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FmlValidatorConfiguration,
  FmlValueState,
  FmlValueStateChangeHandler,
} from '@evanbb/fml-core';
import type { Noop } from '@evanbb/fml-core';
import { createValidator } from '@evanbb/fml-core';
import { FmlFormComponentProps } from './FmlComponent';

function named<TFunc extends (...params: any[]) => any>(
  name: string,
  func: TFunc,
): TFunc {
  const sanitizedName = name.replace(/[^a-zA-Z]/gi, '');
  return new Function(
    'impl',
    `const f = impl; return function ${sanitizedName} () { return f.apply(this, arguments); }`,
  )(func);
}

function useWhatChanged(label: string, thing: any) {
  const objRef = useRef({
    previous: thing,
  });

  console.log(`### COMPARISON FOR ${label} ###`);

  const diff = Object.keys(thing).reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: {
        was: (objRef.current.previous as any)[curr],
        is: (thing as any)[curr],
        same: (objRef.current.previous as any)[curr] === (thing as any)[curr],
      },
    }),
    {},
  );

  console.table(diff);

  console.log(`### END OF COMPARISON FOR ${label} ###`);

  objRef.current.previous = thing;
}

//#region new hooks

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
  const { hasBeenTouched, focusHandler } = useFmlComponentFocus(props);

  const {
    validationMessages,
    changeHandler,
    doValidation,
  } = useFmlComponentChange(
    props,
    currentValue,
    setCurrentValue,
    hasBeenTouched,
  );

  const { blurHandler } = useFmlComponentBlur(
    currentValue,
    doValidation,
    props.controlId,
  );

  return {
    onChange: changeHandler,
    onFocus: focusHandler,
    onBlur: blurHandler,
    value: currentValue.value,
    // we want to store the validation messages in state,
    // but don't display any if the component hasnt even been touched yet
    validationMessages: hasBeenTouched ? validationMessages : [],
  };
}

//#region utility hooks

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
  controlId,
}: FmlFormComponentProps<TValue>) {
  const [hasBeenTouched, setHasBeenTouched] = useState<boolean>(false);

  const focusHandler = useCallback(
    named(`${controlId}FocusHandler`, () => setHasBeenTouched(true)),
    [],
  );

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
  controlId: string,
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
  }, [hasBeenBlurred, value]);

  return {
    blurHandler,
    hasBeenBlurred,
  };
}

function useFmlComponentValidationPromiseCounter() {
  const ref = useRef<number>(Number.MIN_SAFE_INTEGER);
  return {
    current: () => ref.current,
    next: () => ++ref.current,
  };
}

function useFmlComponentChange<TValue>(
  { onChange, config, controlId }: FmlFormComponentProps<TValue>,
  componentState: UseFmlComponentState<TValue>,
  setComponentState: React.Dispatch<
    React.SetStateAction<UseFmlComponentState<TValue>>
  >,
  hasBeenTouched: boolean,
) {
  const {
    current: getCurrentPromiseReference,
    next: nextPromiseReferenceFactory,
  } = useFmlComponentValidationPromiseCounter();
  const validatorFuncs = useFmlValidators<TValue>(
    (config.validators || []) as FmlValidatorConfiguration<TValue>[],
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
    [validatorFuncs.join('')],
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
    [doValidation],
  );

  // any time value changes, inform parent
  useEffect(() => {
    onChange(stateValue);
  }, [stateValue]);

  return { validationMessages, changeHandler, doValidation };
}

function useFmlValidators<TValue>(
  validators: FmlValidatorConfiguration<TValue>[],
) {
  return useMemo(
    () =>
      validators.map((validator) =>
        createValidator<TValue>(
          validator as FmlValidatorConfiguration<TValue> & { args: [] },
        ),
      ),
    [validators],
  );
}

//#endregion

//#endregion
