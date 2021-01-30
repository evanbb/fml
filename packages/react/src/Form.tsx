import { FormConfig } from '@evanbb/fml-core';
import { useRef } from 'react';
import FmlComponent from './common/FmlComponent';
import { FmlContextProvider, FmlContextShape } from './common/FmlContext';

interface FormProps<TModel> {
  config: FormConfig<TModel>;
  formName: string;
}

export default function Form<TModel>({ config, formName }: FormProps<TModel>) {
  const value = useRef<FmlContextShape>({ currentFormPath: formName });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        const result = Array.from(
          new FormData(e.currentTarget).entries(),
        ).reduce((aggregate, entry) => {
          const path = entry[0];
          const value = entry[1];

          const segments = path.split('[').map((s) => s.replace(']', ''));

          console.log('PATH: ', path);

          let currentPointer: any = aggregate;

          segments.forEach((segment, idx) => {
            if (idx === segments.length - 1) {
              currentPointer[segment] = value;
              return;
            }

            const nextValueArrayIndex = parseInt(segments[idx + 1], 10);

            if (!currentPointer[segment]) {
              currentPointer[segment] = !isNaN(nextValueArrayIndex) ? [] : {};
            }

            currentPointer = currentPointer[segment];
          });

          for (const segment of segments) {
            console.log(segment);
          }

          console.log('/PATH: ', path);

          return aggregate;
        }, {});

        console.log(JSON.stringify(result, null, 2));
      }}
    >
      <FmlContextProvider value={value.current}>
        <FmlComponent config={config} />
      </FmlContextProvider>
      <input type='submit' />
    </form>
  );
}
