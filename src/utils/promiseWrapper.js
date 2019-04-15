// @flow

type PromiseSuccess<T> = {
  result: T,
  status: 'success'
};

type PromiseFailure = {
  error: mixed,
  status: 'error'
};

export type PromiseResult<T> = PromiseSuccess<T> | PromiseFailure;

type PromiseFunction<A, T> = (...args: Array<A>) => Promise<T>;

export function promiseWrapper<A, T>(
  promiseFunc: PromiseFunction<A, T>
): PromiseFunction<A, PromiseResult<T>> {
  return (...args: Array<A>): Promise<PromiseResult<T>> => {
    return promiseFunc(...args).then(
      result => ({ result, status: 'success' }),
      error => ({ error, status: 'error' })
    );
  };
}

export function promiseWrapperSuccess<A, T>(
  promiseFunc: PromiseFunction<A, T>
): PromiseFunction<A, PromiseResult<T>> {
  return (...args: Array<A>): Promise<PromiseResult<T>> => {
    return promiseFunc(...args).then(result => ({ result, status: 'success' }));
  };
}
