import { HocuspocusProviderWebsocket } from '@hocuspocus/provider';
import { useMemo } from 'react';
import { Form } from './components/Form';
import { Provider } from './components/Provider';

const App = () => {
  const ws = useMemo(() => {
    return new HocuspocusProviderWebsocket({
      url: 'ws://localhost:12000',
      connect: true,
    });
  }, []);

  const { room, userID } = useMemo(() => {
    const search = new URLSearchParams(window.location.search);
    const room = search.get('room') || '';
    const userID = search.get('userID') || '';

    return { room, userID };
  }, []);

  const isValid = useMemo(() => {
    return room && userID;
  }, [room, userID]);

  if (isValid) {
    return <Provider ws={ws} room={room} userID={userID} />;
  }

  return <Form />;
};

export default App;
