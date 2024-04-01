import { program } from "commander";
import { extractAndEdit } from "./extract";
import { describe } from "./describe";

program.name("qm");

program
  .command("extract")
  .argument("<path>", "path to image file to extract text from")
  .action(extractAndEdit);

program
  .command("describe")
  .argument("<path>", "path to image file to describe")
  .action(describe);

async function main() {
  await program.parseAsync(process.argv);
}

main();
