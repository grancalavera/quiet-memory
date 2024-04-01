import { program } from "commander";
import fs from "node:fs/promises";

program
  .name("extract")
  .argument("<path>", "path to image file to extract text from")
  .action(async (apath: string) => {
    if (!apath) {
      console.log("No path provided");
      process.exit(1);
    }
    // Validate path exists
    try {
      await fs.access(apath);
    } catch (error) {
      console.error("Invalid path:", apath);
      process.exit(1);
    }

    // Continue with the rest of the code
    console.log("look here honey", { path: apath });
  });
