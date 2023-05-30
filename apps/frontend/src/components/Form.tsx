import * as Form from '@radix-ui/react-form';
import { FC, FormEventHandler } from 'react';
import './styles.css';

export const RoomForm: FC = () => {
  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const roomID = data.get('roomID') as string;
    const userID = data.get('userID') as string;
    const name = data.get('name') as string;

    if (!roomID || !userID || !name) {
      alert('Please enter a room ID and user ID');
      return;
    }

    window.location.href = `/?room=${roomID}&userID=${userID}&name=${name}`;
  };

  return (
    <div
      style={{
        backgroundColor: '#212121',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: 20,
      }}
    >
      <Form.Root className="FormRoot" onSubmit={onSubmit}>
        <Form.Field className="FormField" name="roomID">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <Form.Label className="FormLabel">Room ID</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter room id
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="text" required name="roomID" />
          </Form.Control>
        </Form.Field>
        <Form.Field className="FormField" name="userID">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <Form.Label className="FormLabel">User ID</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter User
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="text" required name="userID" />
          </Form.Control>
        </Form.Field>

        <Form.Field className="FormField" name="name">
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
            }}
          >
            <Form.Label className="FormLabel">Name</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter Name
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input className="Input" type="text" required name="name" />
          </Form.Control>
        </Form.Field>
        <Form.Submit asChild>
          <button className="Button" style={{ marginTop: 10 }}>
            Join
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};
