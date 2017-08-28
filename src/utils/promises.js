/**
 * This ensures that all promises have finished before throwing any errors. Useful when you need to
 * be able to clean up after yourself, but have many async operations happening at once
 *
 * try {
 *  const promises = [];
 *  const locksHeld = [];
 *
 *  files.forEach(file => {
 *    promises.push(getLockForFile(f)
 *      .then(lock => { locksHeld.push(lock) })
 *    );
 *  });
 *
 *  await Promise.all(promises); // BAD: leaves us with locks that hadnt resolved yet
 *  await settleAll(locksHeld); // GOOD: We dont throw until after all promises have resolved
 * } catch(err) {
 *  // need to release the locks we have
 *  releaseLocksForFiles(locksHeld);
 * }
 * */
export async function settleAll(promises) {
  let error;
  let results = [];

  for (let promise of promises) {
    try {
      results.push(await promise);
    } catch (err) {
      error = err;
    }
  }

  if (error) {
    throw error;
  } else {
    return results;
  }
}