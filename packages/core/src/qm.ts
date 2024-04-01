import { program } from "commander";
import { extractCommand } from "./extract";
import {
  describeCommand,
  describeDirCommand,
  describedSuffix,
} from "./describe";
import {
  createDocumentEmbeddingCommand,
  createEmbeddingsForDirectoryCommand,
} from "./embed";

program.name("qm");

program
  .command("extract")
  .argument("<path>", "path to image file to extract text from")
  .action(extractCommand);

program
  .command("describe")
  .argument("<path>", "path to image file to describe")
  .action(describeCommand);

program
  .command("describe-dir")
  .argument("<path>", "path to directory to describe")
  .action(describeDirCommand);

program
  .command("embed-document")
  .argument("<path>", "path to text file to embed")
  .action(createDocumentEmbeddingCommand);

program
  .command("embed-dir")
  .argument("<path>", "path to directory to embed")
  .action(createEmbeddingsForDirectoryCommand(describedSuffix));

async function main() {
  await program.parseAsync(process.argv);
}

main();
