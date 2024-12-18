"use client";

import DarkModeToggle from "@/components/dark-mode-toggle";
import PurchaseWidget from "@/components/purchase-widget";
import HyperText from "@/components/ui/hyper-text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

      <div className="w-full text-center justify-center">
        <Tabs defaultValue="trending" className="w-full">
          <TabsList>
            <TabsTrigger value="trending">Trending Ratings</TabsTrigger>
            <TabsTrigger value="createRating">Create Rating</TabsTrigger>
          </TabsList>
          <TabsContent value="trending">Trending coming soon!</TabsContent>
          <TabsContent value="createRating">
            <PurchaseWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
