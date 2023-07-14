const { exec } = require('child_process');
const { format } = require('date-fns');
const { writeFile } = require('fs');
const path = require('path');

function getStagedDiff() {
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

function getFileContent(fileName) {
  return new Promise((resolve, reject) => {
    exec(`git show :${fileName}`, (error, stdout) => {
      if (error) {
        console.error(`Failed to get content for file ${filename}:`, error);
        reject(error);
      }
      resolve(stdout);
    });
  });
}

function saveSummery(content) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const fileName = `${today}.md`;

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

  const promiseFuncs = [];

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
