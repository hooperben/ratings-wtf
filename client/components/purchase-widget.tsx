"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useMutation } from "@tanstack/react-query";
import URLPreview, { URLPreviewProps } from "./url-preview";
import FlickeringGrid from "./ui/flickering-grid";

const isValidUrl = (input: string) =>
  input.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/);

const PurchaseWidget = () => {
  const [url, setUrl] = useState("https://");

  const isUrlInvalid = !isValidUrl(url);

  const [ogData, setOgData] = useState<{ htmlInferred: URLPreviewProps }>();

  const { mutateAsync: getOgData, isPending: isLoadingSearchedOgData } =
    useMutation({
      mutationKey: ["og-search", url],
      mutationFn: async () => {
        const cachedData = localStorage.getItem(encodeURIComponent(url));
        if (cachedData) {
          return JSON.parse(cachedData);
        }
        const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data;
      },
      onSuccess: (data) => {
        localStorage.setItem(encodeURIComponent(url), JSON.stringify(data));
        setOgData(data);
      },
      onError: (err) => {
        console.error(err);
      },
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await getOgData();
  };

  useEffect(() => {
    // Check all localStorage/previously searched og data
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && isValidUrl(decodeURIComponent(key))) {
        const data = localStorage.getItem(key);
        if (data) {
          console.log(
            `Found cached data for ${decodeURIComponent(key)}:`,
            JSON.parse(data),
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    console.log(ogData);
  }, [ogData]);

  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-sm">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 justify-center items-center"
      >
        {!ogData && (
          <>
            <p>enter the site you&apos;d like to rate</p>
            <textarea
              value={url}
              onChange={(e) => {
                const input = e.target.value;
                // Only update if input has content, otherwise keep the placeholder
                setUrl(input || "https://");
              }}
              placeholder="https://"
              className="px-4 py-2 border rounded dark:bg-gray-800 dark:border-gray-700 min-w-[18rem] max-w-full w-full resize-none overflow-hidden"
              rows={url.length / 26}
              required
            />
          </>
        )}
        {ogData && (
          <Button variant="destructive" onClick={() => setOgData(undefined)}>
            Start Again
          </Button>
        )}

        {isLoadingSearchedOgData && (
          <div className="relative w-56 size-[200px] rounded-lg bg-background overflow-hidden border">
            <FlickeringGrid
              className="z-0 relative inset-0 [mask-image:radial-gradient(450px_circle_at_center,white,transparent)]"
              squareSize={4}
              gridGap={6}
              color="#60A5FA"
              maxOpacity={0.5}
              flickerChance={0.1}
              height={300}
              width={300}
            />
          </div>
        )}
        {!ogData && (
          <Button
            disabled={isUrlInvalid || isLoadingSearchedOgData || !!ogData}
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded w-56"
          >
            Prepare Rating
          </Button>
        )}

        {ogData && (
          <div className="flex flex-col gap-2">
            <URLPreview htmlInferred={ogData.htmlInferred} />
            <div className="flex flex-col gap-2">
              <p className="text-sm text-center">
                No one has rated 👍 or 👎 on {ogData.htmlInferred.url} (yet).
              </p>

              <div className="flex flex-row gap-2 w-full mt-4">
                <Button className="flex-1">👍</Button>
                <Button className="flex-1">👎</Button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PurchaseWidget;
