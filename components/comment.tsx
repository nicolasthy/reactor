"use client";

import { RefObject, useRef, useState } from "react";
import { Comment } from "./comments";

import { autoPlacement, inline, offset, useFloating } from "@floating-ui/react";
import { useClickAway } from "@uidotdev/usehooks";
import { useHotkeys } from "react-hotkeys-hook";

import { AnimatePresence, motion } from "framer-motion";

const reactions = ["👍", "👎", "❤️", "🔥", "🚀"];

const CommentItem = ({
  comment,
  onCreate,
  setCanCreate,
}: {
  comment: Comment;
  onCreate: (values: { content?: string; reaction?: string }) => void;
  setCanCreate: (value: boolean) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isCreating, setIsCreating] = useState(true);

  const [reaction, setReaction] = useState(comment.reaction);
  const [content, setContent] = useState(comment.content);

  const handleCreate = () => {
    onCreate({ content, reaction });
    setIsCreating(false);
    setCanCreate(true);
    setIsHovered(false);
  };

  useHotkeys(
    "esc",
    () => {
      if (isCreating) {
        setIsCreating(false);
        setCanCreate(true);
      }
    },
    { enableOnFormTags: true },
  );

  useHotkeys(
    "enter",
    () => {
      if (isCreating) {
        handleCreate();
      }
    },
    { enableOnFormTags: true },
  );

  const containerRef = useClickAway(() => {
    if (isCreating) {
      setIsCreating(false);
      setCanCreate(true);
    }
  });

  const ref = useRef<HTMLDivElement>(null);

  const { refs, floatingStyles } = useFloating({
    strategy: "fixed",
    placement: "right-start",
    elements: {
      reference: ref?.current,
    },
    middleware: [offset(4), autoPlacement(), inline()],
  });

  return (
    <div
      onClick={(event) => event.stopPropagation()}
      ref={containerRef as RefObject<HTMLDivElement>}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        ref={ref}
        className="absolute min-w-8 min-h-8 bg-slate-800 rounded-full rounded-tl-none shadow-pretty-card overflow-hidden"
        style={{
          y: comment.position.y,
          x: comment.position.x,
        }}
        onClick={() => {
          if (isCreating) return;
          setCanCreate(false);
        }}
      >
        <div className="flex gap-x-2">
          <div
            className="h-6 w-6 mt-1 ml-1 text-xs rounded-full flex flex-col justify-center items-center"
            style={{ backgroundColor: comment.color }}
          >
            <span>{comment.reaction}</span>
          </div>
          <AnimatePresence mode="popLayout">
            {isHovered && comment.content && (
              <motion.div
                layout
                className="text-sm text-white py-2 pr-8 flex flex-col overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <span className="text-xs text-slate-400 text-nowrap">
                  Added {comment.createdAt.fromNow()}
                </span>
                <span>{comment.content}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <AnimatePresence>
        {isCreating && (
          <div ref={refs.setFloating} style={floatingStyles}>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
              className="rounded-lg bg-slate-800 shadow-pretty-card p-0 flex flex-col gap-y-2"
            >
              <div className="flex items-center gap-x-4 px-3 pt-1.5">
                {reactions.map((r, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 text-xs flex flex-col items-center border border-transparent justify-center rounded-full bg-transparent hover:bg-slate-700 data-[selected=true]:bg-slate-700 transition-colors duration-300 data-[selected=true]:border-blue-500"
                    data-selected={r === reaction}
                    onClick={() => {
                      setReaction(r);
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-x-2 pr-2 border-t border-slate-700/50">
                <input
                  autoFocus
                  type="text"
                  placeholder="Add a comment"
                  className="flex h-9 w-full rounded-md bg-transparent text-slate-50 px-3 py-0 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none"
                  onChange={(event) => setContent(event.target.value)}
                />

                <button
                  className="w-6 h-6 flex flex-col items-center justify-center rounded-full bg-slate-600 shrink-0 hover:bg-blue-500 transition-colors duration-300"
                  onClick={() => handleCreate()}
                >
                  {/* prettier-ignore */}
                  <svg width="12" height="12" fill="none" xmlns="http://www.w3.org/2000/svg" > <path d="M1.35 4.632c.006-.2.09-.391.234-.531L5.381.304A.773.773 0 0 1 6.608.301l.003.005L10.406 4.1a.774.774 0 0 1-.842 1.267.773.773 0 0 1-.251-.175L6.768 2.65v8.567a.773.773 0 1 1-1.546 0V2.65L2.677 5.194a.773.773 0 0 1-1.327-.562Z" fill="currentColor" /> </svg>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { CommentItem };
