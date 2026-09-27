import React from "react";
import { Composition, Still } from "remotion";
import { HankutReel } from "./HankutReel";
import { HankutThumbnail } from "./HankutThumbnail";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HankutReel"
        component={HankutReel}
        durationInFrames={18 * 30} // 18 seconds at 30 fps
        fps={30}
        width={1080}
        height={1920}
      />
      <Still
        id="HankutThumbnail"
        component={HankutThumbnail}
        width={1080}
        height={1920}
      />
    </>
  );
};
