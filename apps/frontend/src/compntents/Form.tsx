import { FC, FormEventHandler } from 'react';

export const Form: FC = () => {
  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const roomID = data.get('roomID') as string;
    const userID = data.get('userID') as string;

    if (!roomID || !userID) {
      alert('Please enter a room ID and user ID');
      return;
    }

    window.location.href = `/?room=${roomID}&userID=${userID}`;
  };

  return (
    <form onSubmit={onSubmit}>
      <input type="text" placeholder="Room ID" name="roomID" />
      <input type="text" placeholder="User ID" name="userID" />
      <button type="submit">Submit</button>
    </form>
  );
};
