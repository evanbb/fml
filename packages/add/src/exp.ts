import { FmlConfiguration } from '@fml/core';

type MyModel = {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  //   phoneNumber1: number;
  //   phoneNumber2: number;
  //   phoneNumber3: number;
  //   phoneNumber4: number;
  //   phoneNumber5: number;
  //   phoneNumber6: number;
  //   phoneNumber7: number;
  //   phoneNumber8: number;
  //   phoneNumber9: number;
  //   phoneNumber10: number;
  //   phoneNumber11: number;
  //   phoneNumber12: number;
  //   phoneNumber13: number;
  //   phoneNumber14: number;
  //   phoneNumber15: number;
  //   phoneNumber16: number;
  //   phoneNumber17: number;
  //   phoneNumber18: number;
  //   phoneNumber19: number;
  //   phoneNumber20: number;
};

type ModelPropertyConfiguration<PropertyName, PropertyType> = [
  PropertyName,
  FmlConfiguration<PropertyType>,
];

type ModelConfiguration2<Model> = ModelConfigurationRecursive<
  Model,
  keyof Model,
  []
>;

type ModelConfigurationRecursive<
  Model,
  Keys extends keyof Model,
  Accumulator extends unknown[],
> = {
  [K in Keys]: Exclude<Keys, K> extends infer P
    ? [P] extends [never]
      ? [...Accumulator, ModelPropertyConfiguration<K, Model[K]>]
      : P extends keyof Model
      ? ModelConfigurationRecursive<
          Model,
          P,
          [...Accumulator, ModelPropertyConfiguration<K, Model[K]>]
        >
      : never
    : never;
}[Keys];

type ModelConfig2 = ModelConfiguration2<MyModel>;

const confg2: ModelConfig2 = [
  [
    'firstName',
    {
      control: 'text',
      label: 'First Name',
    },
  ],
  [
    'lastName',
    {
      control: 'text',
      label: 'fdhosf',
    },
  ],
];

type ExtendsNever<What> = [What] extends [never] ? 'yes' : 'no';
