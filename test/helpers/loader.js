// Custom ESM loader for tests (if needed in future)
// Currently empty but required by .mocharc.json
export async function resolve(specifier, context, nextResolve) {
  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  return nextLoad(url, context);
}
