"use client";

import { useState } from "react";

const ThumbsUp = "👍";
const ThumbsDown = "👎";

export const PurchaseWidget = () => {
  const [tokensToPurchase, setTokensToPurchase] = useState(0);
  const [downRatingURL, setDownRatingURL] = useState("");
  const [upRatingURL, setUpRatingURL] = useState("");

  return (
    <div className="flex justify-evenly w-full max-w-2xl">
      <Rating direction="down" setRatingURL={setDownRatingURL} />
      <div className="flex flex-col gap-2 items-center">
        <div className="text-lg font-bold">Tokens to purchase</div>
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered w-full max-w-xs input-sm"
          onChange={(e) => setTokensToPurchase(parseInt(e.target.value))}
        />
      </div>
      <Rating direction="up" setRatingURL={setUpRatingURL} />
    </div>
  );
};

interface RatingProps {
  direction: "up" | "down";
  setRatingURL: (url: string) => void;
}

const Rating = ({ direction, setRatingURL }: RatingProps) => {
  return (
    <div className="flex items-center">
      {direction === "down" && <h2 className="m-0">{ThumbsDown}</h2>}
      <input
        type="text"
        placeholder="Type here"
        className="input input-bordered w-full max-w-xs"
      />
      {direction === "up" && <h2 className="m-0">{ThumbsUp}</h2>}
    </div>
  );
};
