import {
  FmlFormConfiguration,
  FmlModelConfiguration,
  FmlValidationStatus,
  FmlValueStateChangeHandler,
  noop,
} from '@evanbb/fml-core';
import type { Noop } from '@evanbb/fml-core';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import FmlComponent, {
  FmlComponentProps,
  FmlFormComponentProps,
} from './common/FmlComponent';
import { useFmlComponent } from './common/hooks';
import { ValidationMessages } from './ValidationMessages';
import { FmlValueState } from '@evanbb/fml-core/src/types';

type ValueStateModelProps<TValue> = {
  [Key in keyof TValue]: FmlValueState<TValue[Key]>;
};

type ValueStateModel<TValue> = {
  value: ValueStateModelProps<TValue>;
  validity: FmlValidationStatus;
};

function useModelTransform<TValue>(
  props: FmlComponentProps<TValue, FmlModelConfiguration<TValue>>,
) {
  const {
    onChange: updateInnerModel,
    validationMessages,
    onFocus,
    value: innerModel,
  } = useFmlComponent<TValue>(props as FmlFormComponentProps<TValue>);

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
  }, []);

  const modelToInnerValue = useCallback<
    (model: ValueStateModel<TValue>) => [TValue, Set<FmlValidationStatus>]
  >((model: ValueStateModel<TValue>) => {
    const result = {} as TValue;
    const validities = new Set<FmlValidationStatus>();
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
    (property: keyof TValue) => (
      change: FmlValueState<TValue[typeof property]>,
    ) => {
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
  }, [model]);

  return {
    updateProperty,
    validationMessages,
    onFocus,
  };
}

interface ModelPropertyProps<TModel, TPropertyValue> {
  update: (
    propertyName: keyof TModel,
  ) => FmlValueStateChangeHandler<TPropertyValue>;
  schema: FmlFormConfiguration<TPropertyValue>;
  modelControlId: string;
  onFocus: Noop;
  propertyName: keyof TModel;
}

function ModelProperty<TModel, TPropertyValue>({
  modelControlId,
  onFocus,
  propertyName,
  schema,
  update,
}: ModelPropertyProps<TModel, TPropertyValue>) {
  const changeHandler = useCallback((change: FmlValueState<TPropertyValue>) => {
    update(propertyName)(change);
  }, []);

  return (
    <FmlComponent
      onChange={changeHandler}
      onFocus={onFocus}
      controlId={`${modelControlId}[${propertyName}]`}
      config={schema}
    />
  );
}

function Model<TValue>(
  props: FmlComponentProps<TValue, FmlModelConfiguration<TValue>>,
) {
  const {
    updateProperty,
    validationMessages,
    onFocus,
  } = useModelTransform<TValue>(props);

  return (
    <fieldset>
      <legend>{props.config.label}</legend>
      <ValidationMessages validationMessages={validationMessages} />
      {Object.keys(props.config.schema).map((key) => {
        const k = key as keyof TValue;
        type PropertyType = TValue[typeof k];
        return (
          <ModelProperty<TValue, PropertyType>
            key={k as string}
            schema={props.config.schema[k]}
            propertyName={k}
            onFocus={onFocus}
            update={updateProperty}
            modelControlId={props.controlId}
          />
        );
      })}
    </fieldset>
  );
}

export default memo(Model) as typeof Model;
