import { getTodayContents } from './src/diff-summary.js';
import { getQuestion } from './src/get-question.js';
import { output } from './src/output.js';

(async function () {
  const todayContents = await getTodayContents();
  const questionText = await getQuestion(todayContents);

  output(todayContents, 'summary');
  output(questionText, 'summary/question');
})();
