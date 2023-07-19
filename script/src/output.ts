import { format } from 'date-fns';
import path from 'path';
import { writeFile } from 'fs';

export function output(content: string, outputPath: string) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const fileName = `${today}.md`;

  const __dirname = new URL('../../', import.meta.url).pathname;
  const filePath = path.join(__dirname, outputPath, fileName);

  writeFile(filePath, content, (err) => {
    if (err) {
      console.error(`Failed to write file ${fileName}:`, err);
    } else {
      console.log(`File ${fileName} written successfully.`);
    }
  });
}
