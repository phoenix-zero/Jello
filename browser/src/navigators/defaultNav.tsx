import { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const DefaultRouter: FC = () => {
  return (
    <Switch>
      <Route path="/home">
        <div />
      </Route>
      <Route path="/board">
        <div />
      </Route>
      <Route path="/">
        <Redirect to="/home" />
      </Route>
    </Switch>
  );
};

export default DefaultRouter;
