Metamemo
====================

Metamemo provides a declarative interface for encapsulating common transformations on a list of objects. These transformations are memoized, guaranteeing referential equality on subsequent calls for the same transformations.

```ts
  interface IAgeGroup {
    age_group_id: number;
    age_group_name: string;
    sort_order: number;
  }

  const ageList: IAgeGroup[] = [
    { age_group_id: 1, age_group_name: '1 - 5 years', sort_order: 1 },
    { age_group_id: 2, age_group_name: '6 - 10 years', sort_order: 2 },
    ...
  ];

  // this example uses Typescript, but if not using Typescript, just ignore the type argument!
  const ages = new Metamemo<IAgeGroup>(ageList);

  // create an object where keys are `age_group_id`s and values are their corresponding age group objects
  const agesKeyedById = ages.keyBy('age_group_id');

  // if the key you are mapping by is not unique, use `Metamemo.groupBy()`
  // each key is then an array of objects responsible for generating that key
  const agesGroupedById = ages.groupBy('age_group_id');

  // the objects returned from `Metamemo.keyBy()` and `Metamemo.groupBy()` also have `pick` and `valueBy` methods
  // `valueBy` gets the value at `path` in each age group object
  const ageIdToNameMap = agesKeyedById.valueBy('age_group_name');

  // `pick` filters each age group object to it's picked properties
  const ageIdToNameAndSortOrder = agesKeyedById.pick('age_group_name', 'sort_order');

  // all operations are memoized, so referential equality is guaranteed at each step
  assert(agesKeyedById === ages.keyBy('age_group_id'));
  assert(ageIdToNameMap === ages.keyBy('age_group_id').valueBy('age_group_name'));
```

## API
#### Constructor
```ts
Metamemo<T>(collection: T[])
```
Create a new Metamemo.


#### Members
##### *list*
```ts
Metamemo<T>(collection: T[]).list
```
Return original collection used to construct class.

Example:
```ts
const ages = new Metamemo<IAgeGroup>(ageList);
assert(ages.list === ageList);
```


#### Methods
##### *groupBy*
```ts
Metamemo<T>(collection: T[]).groupBy(key: keyof T)
```
Returns object. Keys are the result of getting the value of `key` from each object in `collection`. Values are arrays of object(s) responsible for generating key.
Additionally, return object has two non-enumerable, non-configurable, non-writable methods: `pick()` and `valueBy()`.

Example:
```ts
const ages = new Metamemo<IAgeGroup>(ageList);
console.log(ages.groupBy('age_group_id'));
// {
//  '1': [{ age_group_id: 1, age_group_name: '1 - 5 years', sort_order: 1 }],
//  '2': [{ age_group_id: 2, age_group_name: '6 - 10 years', sort_order: 2 }],
//  pick(),
//  valueBy(),
// }
```

##### *keyBy*
```ts
Metamemo<T>(collection: T[]).keyBy(key: keyof T)
```
Returns object. Keys are the result of getting the value of `key` from each object in `collection`. Values are the first object responsible for generating key.
Additionally, return object has two non-enumerable, non-configurable, non-writable methods: `pick()` and `valueBy()`.

Example:
```ts
const ages = new Metamemo<IAgeGroup>(ageList);
console.log(ages.keyBy('age_group_id'));
// {
//  '1': { age_group_id: 1, age_group_name: '1 - 5 years', sort_order: 1 },
//  '2': { age_group_id: 2, age_group_name: '6 - 10 years', sort_order: 2 },
//  pick(),
//  valueBy(),
// }
```


#### Chained transformations
##### *pick*
```ts
Metamemo<T>(collection: T[]).groupBy|keyBy(key: keyof T).pick(...keys: Array<keyof T>)
```
Returns object. Values are objects composed only of specified `keys`.

Example:
```ts
const ages = new Metamemo<IAgeGroup>(ageList);
console.log(ages.keyBy('age_group_id').pick('age_group_name', 'sort_order'));
// {
//  '1': { age_group_name: '1 - 5 years', sort_order: 1 },
//  '2': { age_group_name: '6 - 10 years', sort_order: 2 },
// }
```

##### *valueBy*
```ts
Metamemo<T>(collection: T[]).groupBy|keyBy(key: keyof T).valueBy(key: keyof T)
```
Returns object. Values are the result of getting `key` from each object.

Example:
```ts
const ages = new Metamemo<IAgeGroup>(ageList);
console.log(ages.keyBy('age_group_id').valueBy('age_group_name'));
// {
//  '1': '1 - 5 years',
//  '2': '6 - 10 years'
// }
```
