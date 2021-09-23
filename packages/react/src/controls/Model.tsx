import {
  Configuration,
  ValidityStatus,
  ValueStateChangeHandler,
  ValueState,
  registerComponent,
  ConfigurationFor,
} from '@fml/core';
import MODEL from '@fml/add/controls/model';
import { FmlContextProvider } from '../common/FmlControlContext';
import { useFmlControl } from '../common/useFmlControl';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FmlComponent from '../common/FmlComponent';
import ValidationMessages from '../common/ValidationMessages';

type ValueStateModelProps<TValue> = {
  [Key in keyof TValue]: ValueState<TValue[Key]>;
};

type ValueStateModel<TValue> = {
  value: ValueStateModelProps<TValue>;
  validity: ValidityStatus;
};

function useModelTransform<Value>(props: ModelProps<Value>) {
  const {
    changeHandler: updateInnerModel,
    validationMessages,
    focusHandler: onFocus,
    value: innerModel,
  } = useFmlControl<Value>(props.config[1]);

  const initialModel = useMemo<ValueStateModelProps<Value>>(() => {
    const result = {} as ValueStateModelProps<Value>;
    Object.keys(props.config[1].schema).forEach((key) => {
      Object.assign(result, {
        [key]: {
          value: innerModel.value
            ? innerModel.value[key as keyof Value]
            : undefined,
          validity: 'unknown',
        },
      });
    });
    return result;
  }, [innerModel.value, props.config[1].schema]);

  const modelToInnerValue = useCallback<
    (model: ValueStateModel<Value>) => [Value, Set<ValidityStatus>]
  >((model: ValueStateModel<Value>) => {
    const result = {} as Value;
    const validities = new Set<ValidityStatus>();
    Object.entries(model.value).forEach((entry) => {
      const key = entry[0] as keyof Value;
      type PropertyType = Value[typeof key];
      Object.assign(result, {
        [key]: (entry[1] as ValueState<PropertyType>).value,
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
      (change: ValueState<Value[typeof property]>) => {
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
  ) => ValueStateChangeHandler<TPropertyValue>;
  schema: any;
  propertyName: keyof TModel;
}

function ModelProperty<TModel, TPropertyValue>({
  propertyName,
  schema: [, schema],
  update,
}: ModelPropertyProps<TModel, TPropertyValue>) {
  const changeHandler = useCallback(
    (change: ValueState<TPropertyValue>) => {
      update(propertyName)(change);
    },
    [propertyName, update],
  );

  return (
    <FmlContextProvider<TPropertyValue>
      localControlId={propertyName as string}
      onChange={changeHandler}
    >
      <FmlComponent config={schema as any} />
    </FmlContextProvider>
  );
}

export interface ModelProps<TValue> {
  config: ConfigurationFor<'fml:model', TValue>;
}

function Model<TValue>(props: ModelProps<TValue>) {
  const { updateProperty, validationMessages, validity } =
    useModelTransform<TValue>(props);
  const [, config] = props.config;

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
            schema={config.schema[k][1] as Configuration<PropertyType>}
            propertyName={k}
            update={updateProperty}
          />
        );
      })}
    </fieldset>
  );
}

registerComponent(MODEL, Model);

export default memo(Model) as typeof Model;
