import type { AxiosPromise, ParamsSerializerOptions } from 'axios'
import axios from 'axios'
import { parse, stringify } from 'qs'
import type { IStringifyOptions, ParsedQs } from 'qs'

export const baseRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    openNotify: true
  },
  paramsSerializer: {
    encode: (param: string): ParsedQs => parse(param),
    serialize: (
      params: Record<string, any>,
      options?: ParamsSerializerOptions | IStringifyOptions | any
    ): string => stringify(params, { ...options, arrayFormat: 'repeat' }),
    indexes: false // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
  }
})

export const fileRequest = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data'
  },
  paramsSerializer: {
    encode: (param: string): ParsedQs => parse(param),
    serialize: (
      params: Record<string, any>,
      options?: ParamsSerializerOptions | IStringifyOptions | any
    ): string => stringify(params, options),
    indexes: false // array indexes format (null - no brackets, false (default) - empty brackets, true - brackets with indexes)
  }
})
