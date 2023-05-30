import { createContext, useContext } from 'react';

type RoomContextType = {
  room: string;
  userID: string;
  name: string;
};

const roomContext = createContext<RoomContextType | null>(null);

export const useRoomContext = () => {
  const context = useContext(roomContext);
  if (!context) {
    throw new Error('useRoomContext must be used within a RoomContextProvider');
  }

  return context;
};

export const RoomContextProvider = roomContext.Provider;
