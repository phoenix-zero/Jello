import { CssBaseline } from '@material-ui/core';
import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import { DefaultNav } from '@/navigators';
import { store } from '@/store';
import ThemeProvider from '@/theme';

const App: FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <CssBaseline />
        <Router>
          <DefaultNav />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
