const LIST = 'fml:list';

declare module '@fml/core' {
  interface ListConfiguration<Value> extends ControlConfigurationBase<Value[]> {
    itemConfig: Configuration<Value>;
  }

  export interface ComponentRegistry<Value> {
    [LIST]: [
      Value extends ReadonlyArray<unknown> ? Value : never,
      ListConfiguration<Value>,
    ];
  }
}

export default LIST;
