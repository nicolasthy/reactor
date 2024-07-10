"use client";

import { useEffect, useState } from "react";
import { CommentItem } from "./comment";
import dayjs, { Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const colors = [
  "#D1C7FF",
  "#9EC5FF",
  "#D4E5B0",
  "#FFCD9D",
  "#B3E7DB",
  "#F1D99D",
  "#FAAEAE",
  "#B4E3EE",
];

export type Comment = {
  id: number;
  content?: string;
  reaction?: string;
  position: {
    x: number;
    y: number;
  };
  createdAt: Dayjs;
  color?: string;
};

const Comments = () => {
  const [canCreate, setCanCreate] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);

  const createComment = (position: { x: number; y: number }) => {
    setComments([
      ...comments,
      {
        id: comments.length + 1,
        content: "",
        reaction: "",
        position,
        createdAt: dayjs(),
        color: colors[Math.floor(Math.random() * 8)],
      },
    ]);
  };

  useEffect(() => {
    if (!canCreate) return;
    setComments(
      comments.filter(
        (comment) => comment.content !== "" || comment.reaction !== "",
      ),
    );
  }, [canCreate]);

  return (
    <div
      className="h-full w-full"
      onClick={(event) => {
        if (!canCreate) return;
        createComment({
          x: event.clientX,
          y: event.clientY,
        });
        setCanCreate(false);
      }}
    >
      {comments.map((comment, index) => {
        return (
          <CommentItem
            key={index}
            comment={comment}
            setCanCreate={(value) => setCanCreate(value)}
            onCreate={(values) => {
              setComments(
                comments.map((c) => {
                  if (c.id === comment.id) {
                    return {
                      ...c,
                      content: values.content,
                      reaction: values.reaction,
                    };
                  }
                  return c;
                }),
              );
            }}
          />
        );
      })}
    </div>
  );
};

export { Comments };
