import { program } from "commander";
import {
  describeCommand,
  describeDirCommand,
  describedSuffix,
} from "./describe";
import {
  createDocumentEmbeddingCommand,
  createEmbeddingsForDirectoryCommand,
  embeddingSuffix,
} from "./embed";
import { generateImageCommand } from "./generate-image";

program.name("qm");

program
  .command("extract")
  .argument("<path>", "path to image file to extract text from.")
  .action(extractCommand);

program
  .command("describe")
  .argument("<path>", "path to image file to describe.")
  .action(describeCommand);

program
  .command("describe-dir")
  .argument("<path>", "path to directory to describe.")
  .action(describeDirCommand);

program
  .command("embed-document")
  .argument("<path>", "path to text file to embed.")
  .action(createDocumentEmbeddingCommand);

program
  .command("embed-dir")
  .argument("<path>", "path to directory to embed.")
  .action(createEmbeddingsForDirectoryCommand(describedSuffix));

program
  .command("generate-image")
  .argument(
    "<path> ",
    "path to text file containing prompt for image generation."
  )
  .action(generateImageCommand);

async function main() {
  await program.parseAsync(process.argv);
}

main();
