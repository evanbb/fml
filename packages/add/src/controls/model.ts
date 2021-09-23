const MODEL = 'fml:model';

declare module '@fml/core' {
  interface ModelConfiguration<Value> extends ControlConfigurationBase<Value> {
    schema: { [Key in keyof Value]: Configuration<Value[Key]> };
  }

  export interface ComponentRegistry<Value> {
    [MODEL]: [
      Value extends FieldValueTypes
        ? never
        : Value extends ReadonlyArray<unknown>
        ? never
        : Value,
      ModelConfiguration<Value>,
    ];
  }
}

export default MODEL;
