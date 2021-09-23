const NUMBER = 'fml:number';

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [NUMBER]: [
      number | undefined,
      ControlConfigurationBase<number | undefined>,
    ];
  }
}

export default NUMBER;
