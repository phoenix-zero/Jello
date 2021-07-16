import { FC } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { DefaultNav } from './navigators';

const App: FC = () => {
  return (
    <Router>
      <DefaultNav />
    </Router>
  );
};

export default App;
