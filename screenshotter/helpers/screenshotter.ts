import type { Page } from "puppeteer";
import type { Queue } from "./queue";

export interface Job {
  url: string;
  hash: string;
}

export async function screenshotter(queue: Queue<Job>, page: Page) {
  while (true) {
    const job = queue.dequeue();
    if (job) {
      try {
        console.log(`Processing url: ${job.url}`);
        // Open URL in current page
        await page.goto(job.url, { waitUntil: "networkidle2" });
        // write the screenshot here
        // Capture screenshot
        console.log(`Running screenshot capture from ${process.cwd()}`);
        await page.screenshot({
          path: `./public/${encodeURIComponent(job.hash)}.png`, // Added .png extension
          fullPage: true,
        });
        console.log("completed job: ", job.hash);
      } catch (error) {
        // report back on error
        console.error(`Error processing queue item: ${error}`);
      }
    }
    // Add a small delay to prevent tight-looping when queue is empty
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
