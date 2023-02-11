import { useEffect, useState } from 'react';
import {
  FmlConfiguration,
  createStateFromConfig,
  FmlFieldConfiguration,
  FmlListConfiguration,
  FmlModelConfiguration,
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
      value,
      state: {
        isDirty,
        isTouched,
        isValid,
        validationMessages,
        validity,
        control,
      },
      bindings: { onBlur, onFocus, setValue: setInternalValue },
    } = createStateFromConfig<string>(config, (change) =>
      setValue((state) => ({
        ...state,
        ...change,
      })),
    );

    return {
      value,
      setValue: setInternalValue,
      onBlur,
      onFocus,
      validity,
      validationMessages,
      isValid,
      isDirty,
      isTouched,
      control,
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
      itemBindings,
      itemState,
      keyOf,
    },
    setValue,
  ] = useState(() => {
    const {
      value,
      state: {
        isDirty,
        isTouched,
        isValid,
        validationMessages,
        validity,
        items: itemState,
      },
      bindings: { addItem, items: itemBindings, removeItem, keyOf },
    } = createStateFromConfig<V[]>(config, (change) => {
      setValue((state) => ({
        ...state,
        ...change,
      }));
    });

    return {
      value,
      addItem,
      removeItem,
      validity,
      validationMessages,
      isValid,
      isDirty,
      isTouched,
      itemBindings,
      itemState,
      keyOf,
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
    itemBindings,
    itemState,
    keyOf,
  };
}

export function TestingList() {
  const {
    addItem,
    removeItem,
    validationMessages,
    validity,
    value,
    itemBindings,
    keyOf,
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
    defaultValue: [
      '1',
      '23',
      '',
      '5',
      '99',
    ]
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
      {value.map((item, idx) => {
        const id = keyOf(idx);
        return (
          <div key={id}>
            {JSON.stringify(item, null, 2)}
            {JSON.stringify(keyOf(idx), null, 2)}
            <button
              onClick={(e) => {
                e.preventDefault();
                removeItem(idx);
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
      schemaState,
      schemaBindings,
    },
    setValue,
  ] = useState(() => {
    const {
      value,
      bindings: { schema: schemaBindings },
      state: {
        isDirty,
        isTouched,
        isValid,
        schema: schemaState,
        validationMessages,
        validity,
      },
    } = createStateFromConfig(config, (change) => {
      setValue((state) => ({
        ...state,
        ...change,
      }));
    });
    return {
      value,
      validity,
      validationMessages,
      isValid,
      isDirty,
      isTouched,
      schemaState,
      schemaBindings,
    };
  });

  return {
    value,
    isDirty,
    isTouched,
    isValid,
    validationMessages,
    validity,
    schemaState,
    schemaBindings,
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
    schemaState,
    schemaBindings,
  } = useFmlModel({
    label: 'Model',
    schema: {
      value: { control: 'text', label: 'Value', defaultValue: '' },
    },
  });

  useEffect(() => {
    // setInterval(() => {
    //   setPropertyValue('value', (performance.now() / 10).toFixed());
    // }, 150);
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
