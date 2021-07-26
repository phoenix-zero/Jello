import { useDispatch } from './';
import client from './apolloClient';
import { setTheme } from './reducer/app';

import { runThemeSubscription } from '@/gql';
import { useEffect } from 'react';

const EventListener = (): null => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handler = runThemeSubscription(client, { variables: {} }).subscribe(
      value => {
        const { data } = value;
        data ? dispatch(setTheme(data.userTheme)) : null;
      },
      (err: unknown) => {
        console.log(err);
      },
    );
    return () => handler.unsubscribe();
  }, [dispatch]);

  return null;
};

export default EventListener;
