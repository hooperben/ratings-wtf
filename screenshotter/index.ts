import express, { type Request, type Response } from "express";
import path from "path";
import puppeteer from "puppeteer";
import { Queue } from "./helpers/queue";
import { screenshotter, type Job } from "./helpers/screenshotter";
import cors from "cors";
import * as crypto from "crypto";

const app = express();
const port = process.env.PORT || 3001;

// Launch the browser and open a new blank page
const browser = await puppeteer.launch({ headless: false });
const page = await browser.newPage();
await page.setViewport({ width: 1080, height: 1024 });

const queue = new Queue<Job>();

screenshotter(queue, page);

app.use(
  cors({
    origin: "http://localhost:3000",
  }),
);
app.use(express.json());

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "coming through, over" });
});

app.post("/screenshot", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    const hash = crypto.createHash("sha256").update(url).digest("hex");

    queue.enqueue({
      url,
      hash,
    });

    res.json({ message: "Screenshot endpoint reached", jobId: hash });
  } catch (error) {
    res.status(500).json({ error: "Failed to take screenshot" });
  }
});

// Serve static files from the 'public' directory
app.use(express.static(__dirname + "/public"));

app.listen(port, () => {
  console.log(`Screenshot server listening on port ${port}`);
});
