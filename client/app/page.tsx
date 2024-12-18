"use client";

import DarkModeToggle from "@/components/dark-mode-toggle";
import PurchaseWidget from "@/components/purchase-widget";
import HyperText from "@/components/ui/hyper-text";

export default function Home() {
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="w-full p-4 flex justify-end">
        <DarkModeToggle />
      </div>
      <div className="w-full mt-20 flex justify-center">
        <HyperText
          className="text-4xl font-bold text-black dark:text-white"
          text="ratings.wtf"
        />
      </div>
      <PurchaseWidget />
    </div>
  );
}
