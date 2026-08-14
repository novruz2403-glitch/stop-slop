import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Intro, INTRO_DURATION } from "./Intro";
import { Outro, OUTRO_DURATION } from "./Outro";
import { Scene, SCENE_DURATION } from "./Scene";
import { examples } from "./examples";
import { theme } from "./theme";

export const STOP_SLOP_DURATION =
  INTRO_DURATION + examples.length * SCENE_DURATION + OUTRO_DURATION;

export const StopSlop: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg }}>
      <Sequence durationInFrames={INTRO_DURATION}>
        <Intro />
      </Sequence>

      {examples.map((example, i) => (
        <Sequence
          key={example.label}
          from={INTRO_DURATION + i * SCENE_DURATION}
          durationInFrames={SCENE_DURATION}
        >
          <Scene example={example} />
        </Sequence>
      ))}

      <Sequence
        from={INTRO_DURATION + examples.length * SCENE_DURATION}
        durationInFrames={OUTRO_DURATION}
      >
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
