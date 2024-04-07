import { program } from "commander";
import {
  describeCommand,
  describeDirCommand,
  detectDirCommand,
  detectFileCommand,
  editDirCommand,
  editFileCommand,
  embedCommand,
  embedDirCommand,
} from "./commands";
import { queryCommand } from "./query";

program.name("qm");

program
  .command("detect")
  .argument("<path>", "path to image file to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(detectFileCommand);

program
  .command("detect-dir")
  .argument("<path>", "path to directory with files to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(detectDirCommand);

program
  .command("edit")
  .argument("<path>", "path to text file to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(editFileCommand);

program
  .command("edit-dir")
  .argument("<path>", "path to directory to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(editDirCommand);

program
  .command("describe")
  .argument("<path>", "path to image file to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(describeCommand);

program
  .command("describe-dir")
  .argument("<path>", "path to directory to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(describeDirCommand);

program
  .command("embed")
  .argument("<path>", "path to document to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(embedCommand);

program
  .command("embed-dir")
  .argument("<path>", "path to directory to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(embedDirCommand);

program
  .command("query")
  .argument("<query>", "query to run")
  .action(queryCommand);

async function main() {
  await program.parseAsync(process.argv);
}

main();
