# Loop Practise: Senior Level Patterns

## Challenge 1: Memory-Optimized Single-Pass Loop

```javascript
// BAD PRACTICE (Reject in Senior Code Reviews):
// Memory Consumption: High (Creates multiple intermediate arrays)
const processDataBad = (items) => {
  return items
    .filter(item => item.isActive)
    .map(item => ({ id: item.id, value: item.val * 2 }));
};

// OPTIMIZED SENIOR PATTERN:
// Memory Consumption: Low (Single loop, zero extra allocation overhead)
const processDataSenior = (items) => {
  const len = items.length;
  const result = [];
  
  for (let i = 0; i < len; i++) {
    const item = items[i];
    if (item.isActive) {
      result.push({
        id: item.id,
        value: item.val * 2
      });
    }
  }
  return result;
};
