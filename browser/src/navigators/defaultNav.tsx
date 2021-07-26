import { FC, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Header from '@/components/Header';
import LandingPage from '@/pages/Landing';
import { useSelector } from '@/store';
import { fetchCurrentUser } from '@/store/action/user';
import { useDispatch } from 'react-redux';
import EventListener from '@/store/eventListener';

const DefaultRouter: FC = () => {
  const dispatch = useDispatch();

  const isLoggedIn = useSelector(state => Boolean(state.user.currentUser));

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  return isLoggedIn ? (
    <>
      <Header />
      <EventListener />
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
    </>
  ) : (
    <Switch>
      <Route exact path="/">
        <LandingPage />
      </Route>
      <Route path="*">
        <Redirect to="/" />
      </Route>
    </Switch>
  );
};

export default DefaultRouter;
