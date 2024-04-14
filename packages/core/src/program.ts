import { program } from "commander";
import * as commands from "./commands";

program.name("qm");

program
  .command("detect")
  .description("detect text from an image file")
  .argument("<path>", "path to image file to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.detectFileCommand);

program
  .command("detect-dir")
  .description("given a path, detect text from all image files in a directory")
  .argument("<path>", "path to directory with files to detect text from.")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.detectDirCommand);

program
  .command("edit")
  .description("edit a text file to improve readability")
  .argument("<path>", "path to text file to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.editFileCommand);

program
  .command("edit-dir")
  .description("edit all text files in a directory to improve readability")
  .argument("<path>", "path to directory to edit")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.editDirCommand);

program
  .command("describe")
  .description("describe a document")
  .argument("<path>", "path to image file to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.describeCommand);

program
  .command("describe-dir")
  .description("describe all documents in a directory")
  .argument("<path>", "path to directory to describe")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.describeDirCommand);

program
  .command("embed")
  .description("create a vector embedding for a document")
  .argument("<path>", "path to document to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.embedCommand);

program
  .command("embed-dir")
  .description("create vector embeddings for all documents in a directory")
  .argument("<path>", "path to directory to embed")
  .option("--force", "overwrite any existing documents", false)
  .action(commands.embedDirCommand);

program
  .command("store")
  .description("store an embedding in the vector store")
  .argument("<path>", "path to embedding to store")
  .action(commands.storeEmbeddingCommand);

program
  .command("store-dir")
  .description("store all embeddings in a directory in the vector store")
  .argument("<path>", "path to embedding directory to store")
  .action(commands.storeEmbeddingDirCommand);

program
  .command("embed-query")
  .description("embed an arbitrary query")
  .argument("<path>", "path to embedded query document")
  .argument("<query>", "query to embed")
  .action(commands.embedQueryCommand);

program
  .command("process-file")
  .description(
    "process a file: detect, edit, describe, embed, and store in the vector store"
  )
  .argument("<path>", "path to file to process")
  .action(commands.processFileCommand);

program
  .command("process-dir")
  .description(
    "process a directory: detect, edit, describe, embed, and store in the vector store"
  )
  .argument("<path>", "path to directory to process")
  .option("--extension <string>", "extension to filter files by")
  .action((path, options) =>
    commands.processDirCommand(path, options.extension)
  );

program
  .command("naive-query")
  .description("query the vector store directly without processing the results")
  .argument("<query>", "query string")
  .action(commands.naiveQueryCommand);

program
  .command("query")
  .description(
    "reply to a question based on the existing context in the vector store"
  )
  .argument("<query>", "query string")
  .action(commands.ragQueryCommand);

async function main() {
  await program.parseAsync(process.argv);
}

main();
