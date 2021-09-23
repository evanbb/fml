const EXPANDO = 'fml:expando';

declare module '@fml/core' {
  export interface ExpandoConfig {
    defaultExpanded: boolean;
    summary: string;
  }

  export interface ComponentRegistry<Value> {
    [EXPANDO]: [any, ExpandoConfig, any];
  }
}

export default EXPANDO;
