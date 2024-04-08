import { program } from "commander";
import * as commands from "./commands";

program.name("qm");

program
  .command("detect")
  .argument("<path>", "path to image file to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.detectFileCommand);

program
  .command("detect-dir")
  .argument("<path>", "path to directory with files to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.detectDirCommand);

program
  .command("edit")
  .argument("<path>", "path to text file to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.editFileCommand);

program
  .command("edit-dir")
  .argument("<path>", "path to directory to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.editDirCommand);

program
  .command("describe")
  .argument("<path>", "path to image file to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.describeCommand);

program
  .command("describe-dir")
  .argument("<path>", "path to directory to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.describeDirCommand);

program
  .command("embed")
  .argument("<path>", "path to document to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.embedCommand);

program
  .command("embed-dir")
  .argument("<path>", "path to directory to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.embedDirCommand);

program
  .command("store")
  .argument("<path>", "path to embedding to store")
  .action(commands.storeEmbeddingCommand);

// program
//   .command("store-embedding")
//   .argument("<path>", "path to text file to store")
//   .action(storeEmbeddingCommand);

// program
//   .command("store-embeddings-dir")
//   .argument("<path>", "path to directory to store")
//   .action(storeEmbeddingsForDirectoryCommand(embeddingSuffix));

// program
//   .command("query")
//   .argument("<query>", "query to run")
//   .action(queryCommand);

async function main() {
  await program.parseAsync(process.argv);
}

main();
