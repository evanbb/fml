import React, { useEffect, useState } from 'react';
import {
  FmlConfiguration,
  createStateFromConfig,
  createFieldStateFromConfig,
  createListStateFromConfig,
  FmlFieldConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
  createModelStateFromConfig,
} from '@fml/core';
import '@fml/add/validators/required';
import Form from './Form';

interface ExampleShape {
  stringProperty?: string;
  boolProperty?: boolean;
  dateProperty: Date;
  collectionProperty: string[];
  objectProperty: {
    property: string;
  };
}

function useFmlField(config: FmlFieldConfiguration<string>) {
  const [
    {
      value,
      setValue: setInternalValue,
      isDirty,
      isTouched,
      isValid,
      onBlur,
      onFocus,
      validationMessages,
      validity,
    },
    setValue,
  ] = useState(() => {
    const {
      initialValue,
      initialValidity,
      onBlur,
      onFocus,
      setValue: setInternalValue,
    } = createFieldStateFromConfig<string>(config, (change) =>
      setValue((state) => ({
        ...state,
        ...change,
      })),
    );

    return {
      value: initialValue,
      setValue: setInternalValue,
      onBlur,
      onFocus,
      validity: initialValidity,
      validationMessages: [] as string[],
      isValid: false,
      isDirty: false,
      isTouched: false,
    };
  });

  return {
    value,
    setValue: setInternalValue,
    isDirty,
    isTouched,
    isValid,
    onBlur,
    onFocus,
    validationMessages,
    validity,
  };
}

export function TestingField() {
  const {
    value,
    setValue,
    validationMessages,
    onFocus,
    onBlur,
    isDirty,
    isTouched,
    isValid,
    validity,
  } = useFmlField({
    control: 'text',
    label: 'testing',
    defaultValue: '',
    validators: [['required', 'FILL ME']],
  });

  return (
    <label>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {validationMessages.join(', ')}
    </label>
  );
}

function useListStateFromConfig<V>(config: FmlListConfiguration<V>) {
  const [
    {
      value,
      addItem,
      removeItem,
      isDirty,
      isTouched,
      isValid,
      validationMessages,
      validity,
      listItemState,
    },
    setValue,
  ] = useState(() => {
    const {
      initialValue,
      addItem,
      removeItem,
      listItemState,
      initialValidity,
    } = createListStateFromConfig<V>(config, (change) => {
      setValue((state) => ({
        ...state,
        ...change,
      }));
    });

    return {
      value: initialValue,
      addItem,
      removeItem,
      validity: initialValidity,
      validationMessages: [] as string[],
      isValid: false,
      isDirty: false,
      isTouched: false,
      listItemState,
    };
  });

  return {
    value,
    addItem,
    removeItem,
    isDirty,
    isTouched,
    isValid,
    validationMessages,
    validity,
    listItemState,
  };
}

export function TestingList() {
  const {
    addItem,
    removeItem,
    validationMessages,
    validity,
    value,
    listItemState,
  } = useListStateFromConfig<string>({
    itemConfig: {
      label: 'Thing',
      // itemConfig: {
      //   control: 'text',
      //   label: 'Stuff'
      // }
      // schema: {
      //   stuff: {
      control: 'text',
      defaultValue: '',
      // label: 'Stuff',
      // validators: [['required', 'FILL ME']],
      //   },
      // },
    },
    label: 'Items',
  });

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          addItem();
        }}
      >
        Add Item
      </button>
      {value.map((item) => {
        const id = listItemState(item).id;
        return (
          <div key={id}>
            {JSON.stringify(item, null, 2)}
            {JSON.stringify(listItemState(item), null, 2)}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem(listItemState(item).id);
              }}
            >
              delete me!
            </button>
          </div>
        );
      })}
    </>
  );
}

function useFmlModel(config: FmlModelConfiguration<{ value: string }>) {
  const [
    {
      value,
      validity,
      validationMessages,
      isValid,
      isDirty,
      isTouched,
      setPropertyValue,
    },
    setValue,
  ] = useState(() => {
    const { initialValue, initialValidity, setPropertyValue } =
      createModelStateFromConfig(config, (change) => {
        setValue((state) => ({
          ...state,
          ...change,
        }));
      });
    return {
      value: initialValue,
      validity: initialValidity,
      validationMessages: [] as string[],
      isValid: false,
      isDirty: false,
      isTouched: false,
      setPropertyValue,
    };
  });

  return {
    value,
    isDirty,
    isTouched,
    isValid,
    validationMessages,
    validity,
    setPropertyValue,
  };
}

export function TestingModel() {
  const {
    value,
    isDirty,
    isTouched,
    isValid,
    validationMessages,
    validity,
    setPropertyValue,
  } = useFmlModel({
    label: 'Model',
    schema: {
      value: { control: 'text', label: 'Value', defaultValue: '' },
    },
  });

  useEffect(() => {
    setTimeout(() => {
      setPropertyValue('value', 'newValue');
    }, 2000);
  }, []);

  return <>{JSON.stringify(value)}</>;
}

const defaultConfig: FmlConfiguration<ExampleShape> = {
  label: 'This is an example',
  schema: {
    stringProperty: {
      label: 'A string property',
      control: 'text',
      defaultValue: '',
    },
    boolProperty: {
      label: 'A boolean property',
      control: 'checkbox',
      defaultValue: false,
    },
    dateProperty: {
      label: 'A date property',
      control: 'date',
      defaultValue: new Date(),
    },
    collectionProperty: {
      label: 'A collection of strings property',
      itemConfig: {
        label: 'Value of this string',
        control: 'text',
        defaultValue: '',
      },
    },
    objectProperty: {
      label: 'An object property',
      schema: {
        property: {
          label: `The object's property`,
          control: 'text',
          validators: [['required', 'Oh no!']],
          defaultValue: '',
        },
      },
    },
  },
};

const logit = (e: React.FormEvent<HTMLFormElement>, x: any) => {
  e.preventDefault();
  console.log(x);
};

export const ExampleForm = () => {
  return (
    <Form<ExampleShape>
      onSubmit={logit}
      config={defaultConfig}
      formName='example'
      submitText='Submit me!'
    />
  );
};

export const StupidForm = () => {
  return (
    <Form<string>
      onSubmit={logit}
      config={{ label: 'stupid text', control: 'text', defaultValue: '' }}
      formName='stupidform'
      submitText='Submit me!'
    />
  );
};

export const SillyForm = () => {
  return (
    <Form<string[]>
      onSubmit={logit}
      config={{
        label: 'lllllll',
        itemConfig: { label: 'sss', control: 'text', defaultValue: '' },
      }}
      formName='stringValue'
      submitText='Submit me!'
    />
  );
};

const stories = {
  title: 'Stories/Fml/Form',
  component: Form,
};

export default stories;
