/**
 * Senior Level Loop Patterns in Node.js
 * 1. Non-Blocking Event Loop (Chunked Processing)
 * 2. Concurrency Pool Queue
 */

// --- PATTERN 1: Non-Blocking Event Loop Chunking ---
async function processLargeArrayNonBlocking(items, chunkSize, processFn) {
  let index = 0;
  return new Promise((resolve) => {
    function processChunk() {
      const end = Math.min(index + chunkSize, items.length);
      for (let i = index; i < end; i++) {
        processFn(items[i], i);
      }
      index = end;
      if (index < items.length) {
        setImmediate(processChunk); // Yield control back to Event Loop
      } else {
        resolve();
      }
    }
    processChunk();
  });
}

// --- PATTERN 2: Concurrency Rate-Limited Pool ---
async function mapWithConcurrency(tasks, concurrency, asyncWorker) {
  const results = new Array(tasks.length);
  let currentIndex = 0;

  const worker = async () => {
    while (currentIndex < tasks.length) {
      const index = currentIndex++;
      try {
        results[index] = await asyncWorker(tasks[index], index);
      } catch (error) {
        results[index] = { error: error.message };
      }
    }
  };

  const pool = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(pool);
  return results;
}

// --- EXECUTION TEST ---
(async () => {
  console.log("=== Testing Senior Loop Patterns ===");

  // Test 1: Chunking
  const data = Array.from({ length: 100000 }, (_, i) => i);
  console.time("Non-Blocking Chunk");
  await processLargeArrayNonBlocking(data, 5000, (item) => Math.sqrt(item));
  console.timeEnd("Non-Blocking Chunk");

  // Test 2: Concurrency Pool (Max 3 parallel execution)
  const mockTask = (id) => new Promise((res) => setTimeout(() => res(`Task ${id} Done`), 100));
  const tasks = Array.from({ length: 10 }, (_, i) => i + 1);

  console.log("Running Concurrency Pool (Max 3 workers)...");
  const poolResults = await mapWithConcurrency(tasks, 3, mockTask);
  console.log("Pool Output:", poolResults);
})();
