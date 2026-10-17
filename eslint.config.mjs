import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    // Regras novas do React Compiler (eslint-plugin-react-hooks 7) apontam padrões antigos de vários
    // componentes (setState dentro de useEffect). Ficam como aviso até esses componentes serem revistos.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];

export default eslintConfig;
