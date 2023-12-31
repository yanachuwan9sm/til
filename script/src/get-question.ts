import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai';
import { openai } from './client.js';

const MAX_INPUT_LENGTH = 3500;
const MAX_OUTPUT_QUESTION_LENGTH = 300;
const MAX_RECURSION_VALUE = 3;

const SYSTEM_PROMPT = `
あなたは与えられたテキスト(markdown)を読み取り、その内容への理解度を測るための質問文を作成するサービスです。
以下の制約条件と入力文をもとに、ユーザーがその内容の重要性・理解度を測れるように客観的にバランスよく質問文を生成します。
また、出力する質問文は以下の出力例に沿った形として下さい。

# 出力例:
***{質問文の全容がわかるようなタイトル}***

***質問1***: xxx
***質問2***: xxx
***質問n***: xxx


# 制約条件:
・重要なキーワードを取り残さない。
・文章を簡潔に。
・参考文献のURLは質問文には含まない。
・#（見出しレベル1）が複数ある場合は、見出し毎に質問文を生成してください。

# 入力文:
`;

/**
 * 与えられたテキストを元に要約を行い、内容の理解度を測る質問文を生成する
 * @param text 要約するテキスト
 * @param level 現在の再帰レベル
 * @returns 要約
 */
export async function getQuestion(text: string, level = 1): Promise<string> {
  if (
    text.length <= MAX_OUTPUT_QUESTION_LENGTH ||
    level > MAX_RECURSION_VALUE
  ) {
    return text;
  }

  const questionChunks = await generateQuestionChunks(text);
  const joinedQuestion = questionChunks.join('\n');
  return getQuestion(joinedQuestion, level + 1);
}

/**
 * 与えられたテキストから要約チャンクを生成する。
 * @param text 要約するテキストを含む文字列。
 */
async function generateQuestionChunks(text: string): Promise<string[]> {
  const textChunks = sliceStringIntoChunks(text, MAX_INPUT_LENGTH);
  const summaryChunks = await Promise.all(
    textChunks.map((chunk) => generateQuestionChunkChatGPT(chunk))
  );
  return summaryChunks;
}

// 与えられた文字列を指定した長さでチャンクとして分割する関数
function sliceStringIntoChunks(str: string, chunkLength: number): string[] {
  const chunks = [];
  for (let index = 0; index < str.length; index += chunkLength) {
    chunks.push(str.slice(index, index + chunkLength));
  }
  return chunks;
}

// 与えられたテキストから要約内容の理解度を測る質問文のチャンクを生成する関数
async function generateQuestionChunkChatGPT(text: string): Promise<string> {
  const messages: ChatCompletionRequestMessage[] = [
    {
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: SYSTEM_PROMPT,
    },
    {
      role: ChatCompletionRequestMessageRoleEnum.User,
      content: text,
    },
  ];

  const res = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    max_tokens: MAX_OUTPUT_QUESTION_LENGTH,
    messages: messages,
  });

  const chunkSummary = res.data.choices[0]?.message?.content || '';
  return chunkSummary;
}
