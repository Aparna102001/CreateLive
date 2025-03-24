"use client";

type PinnedThreadProps = {
  thread: any;
  onFocus: (threadId: string) => void;
};

const PinnedThread = ({ thread, onFocus }: PinnedThreadProps) => {
  return (
    <div>
      <p>Thread ID: {thread.id}</p>
    </div>
  );
};

export default PinnedThread;
