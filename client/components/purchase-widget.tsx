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

  const [ogData, setOgData] = useState<{
    htmlInferred?: URLPreviewProps;
    jobId: string;
  }>();

  const [lookingForImage, setLookingForImage] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (lookingForImage === 1 && ogData?.jobId) {
      const checkImage = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/${ogData.jobId}.png`,
          );
          if (response.ok) {
            setLookingForImage(2);
          } else {
            // Try again in 1 second if image not ready
            setTimeout(checkImage, 1000);
          }
        } catch (error) {
          console.error("Error checking for image:", error);
          // Retry on error as well
          setTimeout(checkImage, 1000);
        }
      };

      checkImage();
    }
  }, [lookingForImage, ogData?.jobId]);

  // on page load, check for image availability
  useEffect(() => {
    if (ogData?.jobId) {
      const checkImage = async () => {
        try {
          const response = await fetch(
            `http://localhost:3001/${ogData.jobId}.png`,
          );
          if (response.ok) {
            setLookingForImage(2);
          } else {
            // Try again in 1 second if image not ready
            setTimeout(checkImage, 1000);
          }
        } catch (error) {
          console.error("Error checking for image:", error);
          // Retry on error as well
          setTimeout(checkImage, 1000);
        }
      };

      checkImage();
    }
  }, []);

  const { mutateAsync: getOgData, isPending: isLoadingSearchedOgData } =
    useMutation({
      mutationKey: ["og-search", url],
      mutationFn: async () => {
        // const cachedData = localStorage.getItem(encodeURIComponent(url));
        // if (cachedData) {
        //   return JSON.parse(cachedData);
        // }
        // const response = await fetch(`/api/og?url=${encodeURIComponent(url)}`);
        // const data = await response.json();
        // return data;
        const response = await fetch("http://localhost:3001/screenshot", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ url }),
        });
        const data = await response.json();
        setLookingForImage(1);
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
    <div className="flex flex-col items-center justify-center gap-4 p-4 text-sm bg-white dark:bg-black">
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex flex-col gap-2 w-full md:w-[60%] mt-8">
              {/* <URLPreview htmlInferred={ogData.htmlInferred} /> */}
              <div className="flex flex-col gap-2">
                <h1 className="text-xl">{url}</h1>
                <p className="text-sm text-center">
                  No one has rated 👍 or 👎 here yet.
                </p>

                <div className="flex flex-col gap-2 items-center w-full mt-4">
                  <Button className="flex-1 w-20">👍</Button>
                  <Button className="flex-1 w-20">👎</Button>
                </div>
              </div>
            </div>

            {(isLoadingSearchedOgData || lookingForImage === 1) && (
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

            {lookingForImage === 2 && ogData && ogData?.jobId && (
              <div className="relative w-full md:w-[40%] h-auto rounded-lg bg-background overflow-hidden border">
                <img
                  src={`http://localhost:3001/${ogData.jobId}.png`}
                  alt={`Screenshot of ${ogData.jobId}`}
                  className="object-cover w-full h-full"
                />
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default PurchaseWidget;
