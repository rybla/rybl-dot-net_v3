import * as fs from "fs/promises";
import * as fsSync from "fs";
import path from "path";
import config from "@/config.json";

namespace Effect {
  export async function inputFile_text(filepath_relative: string) {
    const filepath_input = path.join(config.input_dir, filepath_relative);
    return await fs.readFile(filepath_input, {
      encoding: "utf8",
    });
  }

  export async function outputFile_text(
    filepath_relative: string,
    content: string,
  ) {
    const filepath_output = path.join(config.output_dir, filepath_relative);
    await fs.mkdir(path.dirname(filepath_output), {
      recursive: true,
    });
    await fs.writeFile(filepath_output, content, {
      encoding: "utf8",
    });
  }

  export async function inputDir(dirpath_relative: string) {
    const dirpath_input = path.join(config.input_dir, dirpath_relative);
    const files_input = await fs.readdir(dirpath_input);
    return files_input;
  }

  export async function useLocalFile(filepath_relative: string) {
    const filepath_input = path.join(config.input_dir, filepath_relative);
    const filepath_output = path.join(config.output_dir, filepath_relative);
    await fs.mkdir(path.dirname(filepath_output), {
      recursive: true,
    });
    return await fs.copyFile(filepath_input, filepath_output);
  }

  export async function useRemoteFile(url: string, filepath_relative: string) {
    const filepath_output = path.join(config.output_dir, filepath_relative);
    if (fsSync.existsSync(filepath_output)) {
      // already downloaded, so, don't need to download again
      return;
    } else {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to download file from ${url}`);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await fs.mkdir(path.dirname(filepath_output), { recursive: true });
      await fs.writeFile(filepath_output, buffer);
      console.log(`Downloaded ${url} to ${filepath_output}`);
    }
  }
}

export default Effect;
