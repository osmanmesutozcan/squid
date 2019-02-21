declare class MediaRecorder {
  constructor(stream: MediaStream);

  start(): void;

  stop(): void;

  onstop: () => void;

  onstart: () => void;

  onerror: (e: any) => void;

  ondataavailable: (e: { data: any }) => void;
}
