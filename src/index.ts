import {
  assign,
  Dictionary,
  groupBy,
  isArray,
  map,
  mapValues,
  memoize,
  pick,
  reduce,
} from 'lodash';

export type PickResult<T> = Pick<T, keyof T> | Array<Pick<T, keyof T>>;
export type ValueByResult<T> = T[keyof T] | Array<T[keyof T]>;

export interface IKeyedMap<T, K extends keyof T> {
  pick(...paths: K[]): Dictionary<PickResult<T>>;
  valueBy(prop: K): Dictionary<ValueByResult<T>>;
}

export default class Metamemo<T> {
  constructor(private data: T[]) {
    this.groupBy = memoize(this.groupBy);
    this.keyBy = memoize(this.keyBy);
  }

  get list(): T[] {
    return this.data;
  }

  groupBy(prop: keyof T): IKeyedMap<T, keyof T> {
    const groupedByProp = groupBy<T>(this.data, prop);
    return this.defineTransforms(groupedByProp);
  }

  keyBy(prop: keyof T): IKeyedMap<T, keyof T> {
    const keyedByProp = reduce<T, Dictionary<T>>(this.data, (accum: Dictionary<T>, value: T) => {
      const key = String(value[prop]);
      if (accum.hasOwnProperty(key)) {
        return accum;
      }

      return assign({}, accum, { [key]: value });
    }, {});
    return this.defineTransforms(keyedByProp);
  }

  private defineTransforms(keyedCollection: Dictionary<T> | Dictionary<T[]>) {
    const resolver = (...paths: Array<keyof T>) => paths.join(':');
    return Object.defineProperties(keyedCollection, {
      pick: {
        value: memoize((...paths: Array<keyof T>): Dictionary<PickResult<T>> =>
          mapValues(keyedCollection, (value: T | T[]): PickResult<T> => {
            if (!isArray<T>(value)) {
              return pick(value, paths);
            }

            return map(value, (datum) => pick(datum, paths));
          }),
          resolver
        ),
      },
      valueBy: {
        value: memoize((prop: keyof T): Dictionary<ValueByResult<T>> =>
          mapValues(keyedCollection, (value: T | T[]): ValueByResult<T> => {
            if (!isArray<T>(value)) {
              return value[prop];
            }

            return map(value, (datum) => datum[prop]);
          })
        ),
      },
    });
  }
}
