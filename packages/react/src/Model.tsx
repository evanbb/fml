import {
  FmlConfiguration,
  FmlModelConfiguration,
  FmlValidityStatus,
  FmlValueStateChangeHandler,
  FmlValueState,
  FmlControlConfiguration,
} from '@fml/core';
import { FmlContextProvider } from './common/FmlControlContext';
import { useFmlControl } from './common/useFmlControl';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FmlComponent from './common/FmlComponent';
import ValidationMessages from './ValidationMessages';

type ValueStateModelProps<Value> = {
  [Key in keyof Value]: FmlValueState<Value[Key]>;
};

type ValueStateModel<Value> = {
  value: ValueStateModelProps<Value>;
  validity: FmlValidityStatus;
};

function useModelTransform<Value>(props: ModelProps<Value>) {
  const {
    onChange: updateInnerModel,
    validationMessages,
    onFocus: onFocus,
    value: innerModel,
    validity,
  } = useFmlControl<Value>(props.config as FmlControlConfiguration<Value>);

  const initialModel = useMemo<ValueStateModelProps<Value>>(() => {
    const result = {} as ValueStateModelProps<Value>;
    Object.keys(props.config.schema).forEach((key) => {
      Object.assign(result, {
        [key]: {
          value: innerModel ? innerModel[key as keyof Value] : undefined,
          validity: 'unknown',
        },
      });
    });
    return result;
  }, [innerModel, props.config.schema]);

  const modelToInnerValue = useCallback<
    (model: ValueStateModel<Value>) => [Value, Set<FmlValidityStatus>]
  >((model: ValueStateModel<Value>) => {
    const result = {} as Value & {};
    const validities = new Set<FmlValidityStatus>();
    Object.entries(model.value).forEach((entry) => {
      const key = entry[0] as keyof Value;
      type PropertyType = Value[typeof key];
      Object.assign(result, {
        [key]: (entry[1] as FmlValueState<PropertyType>).value,
      });
      validities.add(model.value[key].validity);
    });
    return [result, validities];
  }, []);

  const [model, updateModel] = useState<ValueStateModel<Value>>({
    value: initialModel,
    validity: 'unknown',
  });

  const updateProperty = useCallback(
    (property: keyof Value) =>
      (change: FmlValueState<Value[typeof property]>) => {
        updateModel((mod) => {
          const newValue = {
            ...mod.value,
            [property]: change,
          };

          // all the model's validities for properties other than the one that changed
          const validities = Object.keys(mod.value)
            .filter((key) => key !== property)
            .reduce((set, validity) => {
              set.add(validity);
              return set;
            }, new Set<string>());

          validities.add(change.validity);

          const newValidity = validities.has('invalid')
            ? 'invalid'
            : validities.has('unknown') || validities.has('pending')
            ? 'unknown'
            : 'pending';

          return {
            value: newValue,
            validity: newValidity,
          };
        });
      },
    [],
  );

  useEffect(() => {
    const [newModel, validities] = modelToInnerValue(model);

    updateInnerModel({
      value: newModel,
      validity: validities.has('invalid')
        ? 'invalid'
        : validities.has('unknown') || validities.has('pending')
        ? 'unknown'
        : 'pending',
    });
  }, [model, modelToInnerValue, updateInnerModel]);

  return {
    updateProperty,
    validationMessages,
    onFocus,
    validity: validity,
  };
}

interface ModelPropertyProps<TModel, TPropertyValue> {
  update: (
    propertyName: keyof TModel,
  ) => FmlValueStateChangeHandler<TPropertyValue>;
  schema: FmlConfiguration<TPropertyValue>;
  propertyName: keyof TModel;
}

function ModelProperty<TModel, TPropertyValue>({
  propertyName,
  schema,
  update,
}: ModelPropertyProps<TModel, TPropertyValue>) {
  const changeHandler = useCallback(
    (change: FmlValueState<TPropertyValue>) => {
      update(propertyName)(change);
    },
    [propertyName, update],
  );

  return (
    <FmlContextProvider<TPropertyValue>
      localControlId={propertyName as string}
      onChange={changeHandler}
    >
      <FmlComponent config={schema} />
    </FmlContextProvider>
  );
}

export interface ModelProps<Value> {
  config: FmlModelConfiguration<Value>;
}

function Model<Value>(props: ModelProps<Value>) {
  const { updateProperty, validationMessages, validity } =
    useModelTransform<Value>(props);
  const config = props.config as FmlModelConfiguration<Value>;

  return (
    <fieldset>
      <legend data-fml-validity={validity}>{config.label}</legend>
      <ValidationMessages validationMessages={validationMessages} />
      {Object.keys(config.schema).map((key) => {
        const k = key as keyof Value;
        type PropertyType = Value[typeof k];
        return (
          <ModelProperty<Value, PropertyType>
            key={k as string}
            schema={config.schema[k]}
            propertyName={k}
            update={updateProperty}
          />
        );
      })}
    </fieldset>
  );
}

export default memo(Model) as typeof Model;
