/// <reference types="lodash" />
import { Dictionary } from 'lodash';
export declare type PickResult<T> = Pick<T, keyof T> | Array<Pick<T, keyof T>>;
export declare type ValueByResult<T> = T[keyof T] | Array<T[keyof T]>;
export interface IKeyedMap<T, K extends keyof T> {
  pick(...paths: K[]): Dictionary<PickResult<T>>;
  valueBy(prop: K): Dictionary<ValueByResult<T>>;
}
export default class Metamemo<T> {
  private data;
  constructor(data: T[]);
  readonly list: T[];
  groupBy(prop: keyof T): IKeyedMap<T, keyof T>;
  keyBy(prop: keyof T): IKeyedMap<T, keyof T>;
  private defineTransforms(keyedCollection);
}
