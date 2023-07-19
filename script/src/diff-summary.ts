import { exec } from 'child_process';

export async function getTodayContents() {
  const stagedFiles = await getStagedDiff();

  const promiseFuncs: (() => Promise<string>)[] = [];

  stagedFiles.forEach(async (filename) => {
    if (!filename.replaceAll('"', '').endsWith('.md')) return;
    promiseFuncs.push(async () => {
      return await getFileContent(filename);
    });
  });

  const contentsArr = await Promise.all(promiseFuncs.map((func) => func()));
  return contentsArr.join('\n\n');
}

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
