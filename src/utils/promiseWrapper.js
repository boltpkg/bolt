// @flow

export type PromiseSuccess<A, T> = {
  result: T,
  status: 'success',
  args: A
};

export type PromiseFailure<A> = {
  error: any,
  status: 'error',
  args: A
};

export type PromiseResult<A, T> = PromiseSuccess<A, T> | PromiseFailure<A>;

type PromiseFunction<A, T> = (...args: Array<A>) => Promise<T>;

export function promiseWrapper<A, T>(
  promiseFunc: PromiseFunction<A, T>
): PromiseFunction<A, PromiseResult<A, T>> {
  return (...args: Array<A>): Promise<PromiseResult<A, T>> => {
    return promiseFunc(...args).then(
      result => ({ result, status: 'success', args }),
      error => ({ error, status: 'error', args })
    );
  };
}

export function promiseWrapperSuccess<A, T>(
  promiseFunc: PromiseFunction<A, T>
): PromiseFunction<A, PromiseResult<A, T>> {
  return (...args: Array<A>): Promise<PromiseResult<A, T>> => {
    return promiseFunc(...args).then(result => ({
      result,
      status: 'success',
      args
    }));
  };
}
