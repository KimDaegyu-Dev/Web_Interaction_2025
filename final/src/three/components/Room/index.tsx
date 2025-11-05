import { Floor } from './Floor';
import { GridFloor } from './GridFloor';
import { Ceiling } from './Ceiling';
import { Walls } from './Walls';

interface RoomProps {
  useGridFloor?: boolean;
  gridFloorProps?: React.ComponentProps<typeof GridFloor>;
}

export function Room({ useGridFloor = false, gridFloorProps }: RoomProps = {}) {
  return (
    <>
      {useGridFloor && gridFloorProps ? (
        <GridFloor {...gridFloorProps} />
      ) : (
        <Floor />
      )}
      <Ceiling />
      <Walls />
    </>
  );
}

