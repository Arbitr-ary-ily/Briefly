import { useEffect, useRef } from 'react';
import {
  AbsoluteFill,
  Audio,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';

export const NewsVideoComposition = ({ script, audioUrl }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const audioRef = useRef(null);

  const lines = script.split('\n').filter(line => line.trim() !== '');

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
      <Audio src={audioUrl} ref={audioRef} />
      {lines.map((line, index) => {
        const delay = index * 60;
        const opacity = spring({
          fps,
          frame: frame - delay,
          config: { damping: 100 },
        });
        const translateY = interpolate(opacity, [0, 1], [20, 0]);

        return (
          <Sequence from={delay} durationInFrames={120} key={index}>
            <AbsoluteFill
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '32px',
                color: 'white',
                opacity,
                transform: `translateY(${translateY}px)`,
              }}
            >
              {line}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
