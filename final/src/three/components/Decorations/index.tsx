import { FloorPattern } from './FloorPattern';
import { WallArt } from './WallArt';
import { LightFixture } from './LightFixture';
import { Pillars } from './Pillars';

export function Decorations() {
  return (
    <>
      <FloorPattern />
      <WallArt />
      <LightFixture />
      <Pillars />
    </>
  );
}

