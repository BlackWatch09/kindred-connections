import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { StoryMessage } from "../types";

interface Props {
  messages: StoryMessage[];
  streamingText: string;
  isStreaming: boolean;
  characterImage: string;
  characterName: string;
}

const DialogueStream = ({ messages, streamingText, isStreaming, characterImage, characterName }: Props) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingText]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" dir="rtl">
      {messages.map((m) => (
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}
        >
          {m.role === "assistant" && (
            <img
              src={characterImage}
              alt={characterName}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 border border-border"
            />
          )}
          <div
            className={`max-w-[80%] rounded-2xl px-4 py-2.5 font-arabic leading-relaxed text-[15px] ${
              m.role === "user"
                ? "bg-primary text-primary-foreground rounded-tr-sm"
                : "bg-secondary text-secondary-foreground rounded-tl-sm"
            }`}
          >
            {m.content}
          </div>
        </motion.div>
      ))}

      {isStreaming && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
          <img
            src={characterImage}
            alt={characterName}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-1 border border-border"
          />
          <div className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-2.5 bg-secondary text-secondary-foreground font-arabic leading-relaxed text-[15px]">
            {streamingText || (
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </span>
            )}
            {streamingText && <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />}
          </div>
        </motion.div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default DialogueStream;
