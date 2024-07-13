import csv from "csv-parser";
import { formattedRowType, rowType } from "./types";
import { formatRow } from "./utils";
import { PassThrough } from "stream";
import { createObjectCsvStringifier } from "csv-writer";

export interface readFileType {
  results: formattedRowType[];
  duration: number;
}

export function readFile(
  buffer: Buffer
): Promise<{ results: formattedRowType[]; duration: number }> {
  const startTime = performance.now();

  return new Promise((resolve, reject) => {
    const results: formattedRowType[] = [];

    const stream = new PassThrough();
    stream.end(buffer);

    stream
      .pipe(csv())
      .on("data", async (data: rowType) => {
        const formattedRow = await formatRow(data);
        results.push(formattedRow);
      })
      .on("end", () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        resolve({ results, duration });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}

export function writeFile(records: formattedRowType[]) {
  const csvObject = createObjectCsvStringifier({
    header: Object.keys(records[0]).map((key) => ({
      id: key,
      title: key,
    })),
  });

  const csvContent =
    csvObject.getHeaderString() + csvObject.stringifyRecords(records);

  return csvContent;
}
