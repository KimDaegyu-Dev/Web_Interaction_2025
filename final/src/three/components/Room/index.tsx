import { Floor } from './Floor';
import { Ceiling } from './Ceiling';
import { Walls } from './Walls';

export function Room() {
  return (
    <>
      <Floor />
      <Ceiling />
      <Walls />
    </>
  );
}

