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

type ValueStateModelProps<TValue> = {
  [Key in keyof TValue]: FmlValueState<TValue[Key]>;
};

type ValueStateModel<TValue> = {
  value: ValueStateModelProps<TValue>;
  validity: FmlValidityStatus;
};

function useModelTransform<TValue>(props: ModelProps<TValue>) {
  const {
    changeHandler: updateInnerModel,
    validationMessages,
    focusHandler: onFocus,
    value: innerModel,
  } = useFmlControl<TValue>(props.config as FmlControlConfiguration<TValue>);

  const initialModel = useMemo<ValueStateModelProps<TValue>>(() => {
    const result = {} as ValueStateModelProps<TValue>;
    Object.keys(props.config.schema).forEach((key) => {
      Object.assign(result, {
        [key]: {
          value: innerModel.value
            ? innerModel.value[key as keyof TValue]
            : undefined,
          validity: 'unknown',
        },
      });
    });
    return result;
  }, [innerModel.value, props.config.schema]);

  const modelToInnerValue = useCallback<
    (model: ValueStateModel<TValue>) => [TValue, Set<FmlValidityStatus>]
  >((model: ValueStateModel<TValue>) => {
    const result = {} as TValue;
    const validities = new Set<FmlValidityStatus>();
    Object.entries(model.value).forEach((entry) => {
      const key = entry[0] as keyof TValue;
      type PropertyType = TValue[typeof key];
      Object.assign(result, {
        [key]: (entry[1] as FmlValueState<PropertyType>).value,
      });
      validities.add(model.value[key].validity);
    });
    return [result, validities];
  }, []);

  const [model, updateModel] = useState<ValueStateModel<TValue>>({
    value: initialModel,
    validity: 'unknown',
  });

  const updateProperty = useCallback(
    (property: keyof TValue) =>
      (change: FmlValueState<TValue[typeof property]>) => {
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
    validity: innerModel.validity,
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

export interface ModelProps<TValue> {
  config: FmlModelConfiguration<TValue>;
}

function Model<TValue>(props: ModelProps<TValue>) {
  const { updateProperty, validationMessages, validity } =
    useModelTransform<TValue>(props);
  const config = props.config as FmlModelConfiguration<TValue>;

  return (
    <fieldset>
      <legend data-fml-validity={validity}>{config.label}</legend>
      <ValidationMessages validationMessages={validationMessages} />
      {Object.keys(config.schema).map((key) => {
        const k = key as keyof TValue;
        type PropertyType = TValue[typeof k];
        return (
          <ModelProperty<TValue, PropertyType>
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
