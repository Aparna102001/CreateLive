"use client";

type PinnedThreadProps = {
  thread: any;
  onFocus: (threadId: string) => void;
};

export const PinnedThread = ({ thread, onFocus }: PinnedThreadProps) => {
  return (
    <div>
      <p>{thread.metadata?.title}</p> 
    </div>
  );
};


export default PinnedThread;
