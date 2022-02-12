import {
  Configuration,
  ConfigurationFor,
  ValueState,
  ValueStateChangeHandler,
} from '@fml/core';
import FmlComponent from './FmlComponent';
import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

interface FmlContextValue<Value> {
  controlId: string;
  state: ValueState<Value>;
  validationMessages: string[];
  onChange: ValueStateChangeHandler<Value>;
  onBlur: () => void;
  onFocus: () => void;
  hasBeenTouched: boolean;
}

const defaultContextValue: FmlContextValue<unknown> = {
  controlId: '',
  state: {
    value: undefined,
    validity: 'unknown',
  },
  validationMessages: [],
  onChange: () => {},
  onBlur: () => {},
  onFocus: () => {},
  hasBeenTouched: false,
};

const FmlContext = createContext<FmlContextValue<unknown>>(defaultContextValue);
function FmlContextProvider<Value>(
  props: React.PropsWithChildren<{ value: FmlContextValue<Value> }>,
) {
  return (
    <FmlContext.Provider value={props.value as FmlContextValue<unknown>}>
      {props.children}
    </FmlContext.Provider>
  );
}

interface FmlContextAwareComponentProps<Value> {
  localControlId: string;
  config: Configuration<Value>;
}

export default function FmlContextAwareComponent<Value>({
  localControlId,
  config,
}: FmlContextAwareComponentProps<Value>) {
  debugger;
  const controlId = useLocalControlId(localControlId);

  const onBlur = useBlurHandler();
  const { onFocus, hasBeenTouched } = useHasBeenTouched();

  const { validationMessages, state, onChange } =
    useControlState<Value>(config);

  const currentProviderValue = useProviderValue<Value>({
    controlId,
    hasBeenTouched,
    onBlur,
    onChange,
    onFocus,
    validationMessages,
    state,
  });

  return (
    <FmlContextProvider<Value> value={currentProviderValue}>
      <FmlComponent<typeof config[0]>
        config={config as unknown as ConfigurationFor<typeof config[0]>}
      />
    </FmlContextProvider>
  );
}

function useFmlContext() {
  return useContext(FmlContext);
}

function useLocalControlId(localControlId: string) {
  const { controlId } = useFmlContext();
  return controlId ? `${controlId}[${localControlId}]` : localControlId;
}

function useBlurHandler() {
  const { onBlur } = useFmlContext();
  const [hasBlurred, setHasBlurred] = useState(false);

  useEffect(() => {
    if (hasBlurred) {
      onBlur();
    }
  }, [hasBlurred]);

  const blurHandler = useCallback(() => {
    setHasBlurred(true);
  }, [setHasBlurred]);

  return blurHandler;
}

function useHasBeenTouched() {
  const { onFocus } = useFmlContext();
  const [hasBeenTouched, setHasBeenTouched] = useState(false);

  useEffect(() => {
    if (hasBeenTouched) {
      onFocus();
    }
  }, [hasBeenTouched]);

  const focusHandler = useCallback(() => {
    setHasBeenTouched(true);
  }, [setHasBeenTouched]);

  return {
    onFocus: focusHandler,
    hasBeenTouched,
  };
}

function useWhatChanged<T>(value: T) {
  const ref = useRef({
    previousValue: value,
  });
  const { previousValue } = ref.current;
  const changed = previousValue !== value;

  ref.current.previousValue = value;

  useEffect(() => {
    if (changed) {
      console.log('something changed!');
      console.log('previous', previousValue);
      console.log('current', value);
    }
  });

  return {
    previousValue,
    changed,
    value,
  };
}

function useProviderValue<Value>({
  controlId,
  hasBeenTouched,
  onBlur,
  onChange,
  onFocus,
  validationMessages,
  state,
}: FmlContextValue<Value>) {
  const [providerValue, setProviderValue] = useState<FmlContextValue<Value>>({
    controlId,
    hasBeenTouched,
    onBlur,
    onChange,
    onFocus,
    validationMessages,
    state,
  });

  const { value, validity } = state;

  useWhatChanged(controlId);
  useWhatChanged(hasBeenTouched);
  useWhatChanged(onBlur);
  useWhatChanged(onChange);
  useWhatChanged(onFocus);
  useWhatChanged(validationMessages);
  useWhatChanged(value);
  useWhatChanged(validity);

  // update the provider value iff its properties changes
  useEffect(() => {
    setProviderValue({
      controlId,
      hasBeenTouched,
      onBlur,
      onChange,
      onFocus,
      validationMessages,
      state: {
        value,
        validity,
      },
    });
  }, [
    controlId,
    hasBeenTouched,
    onBlur,
    onChange,
    onFocus,
    validationMessages,
    value,
    validity,
  ]);

  return providerValue;
}

function useControlState<Value>(config: Configuration<Value>): {
  state: ValueState<Value>;
  validationMessages: string[];
  onChange: ValueStateChangeHandler<Value>;
} {
  const { onChange: contextOnChange } = useFmlContext();

  // determine default validity based on configured validators
  const [validity, setValidity] =
    useState<ValueState<Value>['validity']>('unknown');

  // set the default value based on configuration
  const [value, setValue] = useState<Value>(null as any as Value);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const changeHandler = useCallback((value: ValueState<Value>) => {}, []);

  // whenever the value or validity changes, notify the parent
  useEffect(() => {
    contextOnChange({
      value,
      validity,
    });
  }, [value, validity]);

  return {
    onChange: changeHandler,
    validationMessages,
    state: {
      value,
      validity,
    },
  };
}
