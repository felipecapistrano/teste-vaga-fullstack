import express, { Request, Response } from "express";
import { readFile, readFileType, writeFile } from "./file";
import multer from "multer";
import cors from "cors";
import { createObjectCsvStringifier } from "csv-writer";

const app = express();
const port = 3001;

app.use(cors());

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      cb(new Error("Only CSV files are allowed"));
    } else {
      cb(null, true);
    }
  },
});

app.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response) => {
    try {
      const startTime = performance.now();

      if (!req?.file) {
        res.status(400).send("No file uploaded.");
        return;
      }
      const result: readFileType = await readFile(req.file.buffer);

      const csvContent = writeFile(result.results);

      const endTime = performance.now();
      const duration = endTime - startTime;
      console.info(`Duration: ${duration} ms`);

      res.header("Content-Type", "text/csv");
      res.attachment("processed.csv");
      res.send(csvContent);
    } catch (e) {
      console.error({ e });
    }
  }
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
