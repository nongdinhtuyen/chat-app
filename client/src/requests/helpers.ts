import type { AxiosPromise } from 'axios'

/**
 * Thực hiện một cuộc gọi API hoặc yêu cầu HTTP bằng hàm được cung cấp.
 *
 * @param fn - Hàm thực hiện yêu cầu HTTP (ví dụ: `axios.get`, `axios.post`, v.v.).
 * @param args - Các tham số được truyền vào hàm `fn`.
 * @returns - Một Promise mà khi resolve sẽ trả về kết quả của cuộc gọi API.
 * @throws - Ném lỗi nếu tham số đầu tiên không phải là một hàm hoặc khi có lỗi trong quá trình thực hiện.
 */
export function axiosRequest<T extends any[], R>(
  fn: (...args: T) => AxiosPromise<R>,
  ...args: T
): AxiosPromise<R> {
  if (typeof fn !== 'function') {
    return Promise.reject(new Error('First argument must be a function'))
  }

  try {
    return fn(...args)
  } catch (error) {
    return Promise.reject(error)
  }
}
