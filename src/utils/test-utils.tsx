import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore } from '../store/store';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const store = setupStore();
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };