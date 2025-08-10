type Success<T> = {
	data: T;
	error: null;
};

type Failure<E> = {
	data: null;
	error: E;
};

type Result<T, E = Error> = Success<T> | Failure<E>;

/**
 * A nicer way to handle errors than a try..catch block.
 *
 * Wraps a function in a try/catch block and returns a result object with the data or error.
 * @param fn - A function that might throw an error
 * @returns A result object with the data or error
 *
 * @example
 * ```ts
 * const { data, error } = tryCatch(() => someSyncOperation());
 * if (error) {
 *   console.error(error);
 * } else {
 *   console.log(data);
 * }
 * ```
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
	try {
		return { data: fn(), error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}

/**
 * A nicer way to handle errors than a try..catch block.
 *
 * Wraps an async function in a try/catch block and returns a result object with the data or error.
 * @param fn - An async function that might throw an error
 * @returns A promise that resolves to a result object with the data or error
 *
 * @example
 * ```ts
 * const { data, error } = await tryCatchAsync(async () => await somePromise);
 * if (error) {
 *   console.error(error);
 * } else {
 *   console.log(data);
 * }
 * ```
 */
export async function tryCatchAsync<T, E = Error>(
	promise: Promise<T>,
): Promise<Result<T, E>> {
	try {
		const data = await promise;
		return { data, error: null };
	} catch (error) {
		return { data: null, error: error as E };
	}
}
