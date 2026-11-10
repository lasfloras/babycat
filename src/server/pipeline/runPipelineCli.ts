import { PipelineRunner } from './pipelineRunner.ts';

async function main() {
  console.log('--- Starting Economic Observatory Daily Pipeline CLI ---');
  const result = await PipelineRunner.run();
  console.log('Pipeline Result:', JSON.stringify(result, null, 2));
  if (result.status === 'error') {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
