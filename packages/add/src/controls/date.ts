const DATE = 'fml:date'

declare module '@fml/core' {
  export interface ComponentRegistry<Value> {
    [DATE]: [Date | undefined, ControlConfigurationBase<Date | undefined>];
  }
}

export default DATE;
