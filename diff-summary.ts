import { exec } from 'child_process';
import { format } from 'date-fns';
import { writeFile } from 'fs';
import path from 'path';

function getStagedDiff(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    exec('git diff --cached --name-only', (error, stdout) => {
      if (error) {
        console.error('Failed to get staged diffs:', error);
        reject(error);
      }
      resolve(stdout.split('\n').filter(Boolean));
    });
  });
}

function getFileContent(fileName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(`git show :${fileName}`, (error, stdout) => {
      if (error) {
        console.error(`Failed to get content for file ${fileName}:`, error);
        reject(error);
      }
      resolve(stdout);
    });
  });
}

function saveSummery(content: string) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const fileName = `${today}.md`;

  const __dirname = new URL('.', import.meta.url).pathname;
  const filePath = path.join(__dirname, 'summary', fileName);

  writeFile(filePath, content, (err) => {
    if (err) {
      console.error(`Failed to write file ${fileName}:`, err);
    } else {
      console.log(`File ${fileName} written successfully.`);
    }
  });
}

(async function () {
  const stagedFiles = await getStagedDiff();

  const promiseFuncs: (() => Promise<string>)[] = [];

  stagedFiles.forEach(async (filename) => {
    if (!filename.replaceAll('"', '').endsWith('.md')) return;
    promiseFuncs.push(async () => {
      return await getFileContent(filename);
    });
  });

  const resultArr = await Promise.all(promiseFuncs.map((func) => func()));
  const fileContent = resultArr.join('\n\n');

  saveSummery(fileContent);
})();
