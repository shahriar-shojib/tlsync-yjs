import { HocuspocusProviderWebsocket } from '@hocuspocus/provider';
import { useMemo } from 'react';
import { RoomForm } from './components/Form';
import { Provider } from './components/Provider';
import { RoomContextProvider } from './context/room.context';

const App = () => {
  const ws = useMemo(() => {
    return new HocuspocusProviderWebsocket({
      url: 'ws://localhost:12000',
      connect: true,
    });
  }, []);

  const values = useMemo(() => {
    const search = new URLSearchParams(window.location.search);
    const room = search.get('room') || '';
    const userID = search.get('userID') || '';
    const name = search.get('name') || '';

    return { room, userID, name };
  }, []);

  const isValid = useMemo(() => {
    return values.room && values.userID && values.name;
  }, [values]);

  if (!isValid) {
    return <RoomForm />;
  }

  return (
    <RoomContextProvider value={values}>
      <Provider ws={ws} />
    </RoomContextProvider>
  );
};

export default App;
