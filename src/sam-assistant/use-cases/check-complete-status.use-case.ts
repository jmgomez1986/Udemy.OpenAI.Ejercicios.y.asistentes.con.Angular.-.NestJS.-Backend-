import OpenAI from 'openai';

interface Options {
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (
  openai: OpenAI,
  options: Options,
) => {
  const { threadId, runId } = options;

  const runStatus = await openai.beta.threads.runs.retrieve(runId, {
    thread_id: threadId,
  });

  console.log({ status: runStatus.status }); // completed

  if (runStatus.status === 'completed') {
    return runStatus;
  }

  // Esperar un segundo antes de volver a consultar el estado
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await checkCompleteStatusUseCase(openai, options);
};
