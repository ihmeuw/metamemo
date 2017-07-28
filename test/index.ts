import { expect } from 'chai';

import Metamemo from '../src/index';

describe('Metamemo', () => {
  interface IAgeGroup {
    age_group_id: number;
    age_group_name: string;
    sort_order: number;
  }

  const ageList = [
    { age_group_id: 1, age_group_name: 'one', sort_order: 1 },
    { age_group_id: 2, age_group_name: 'two', sort_order: 2 },
  ];

  const ageListWithDuplicate = [
    ...ageList,
    { age_group_id: 3, age_group_name: 'three', sort_order: 1 },
  ];

  let ages: Metamemo<IAgeGroup>;
  let agesWithDup: Metamemo<IAgeGroup>;

  beforeEach(() => {
    ages = new Metamemo<IAgeGroup>(ageList);
    agesWithDup = new Metamemo<IAgeGroup>(ageListWithDuplicate);
  });

  it('returns the original list of metadata', () => {
    expect(ages.list).to.be.an('array').and.to.equal(ageList);
  });

  describe('keyBy', () => {
    it('keys metadata by a property on metadata', () => {
      expect(ages.keyBy('age_group_id')).to.deep.equal({
        1: { age_group_id: 1, age_group_name: 'one', sort_order: 1 },
        2: { age_group_id: 2, age_group_name: 'two', sort_order: 2 },
      });
    });

    it('the value of each key is the first element responsible for generating the key', () => {
      expect(agesWithDup.keyBy('sort_order')).to.deep.equal({
        1: { age_group_id: 1, age_group_name: 'one', sort_order: 1 },
        2: { age_group_id: 2, age_group_name: 'two', sort_order: 2 },
      });
    });

    it('returns referentially equal results given same arg', () => {
      expect(ages.keyBy('age_group_id')).to.equal(ages.keyBy('age_group_id'));
    });

    it('returns referentially unequal results given different args', () => {
      expect(ages.keyBy('age_group_id')).to.not.equal(ages.keyBy('age_group_name'));
    });
  });

  describe('groupBy', () => {
    it('returns arrays as values', () => {
      expect(agesWithDup.groupBy('sort_order')).to.deep.equal({
        1: [
          { age_group_id: 1, age_group_name: 'one', sort_order: 1 },
          { age_group_id: 3, age_group_name: 'three', sort_order: 1 },
        ],
        2: [{ age_group_id: 2, age_group_name: 'two', sort_order: 2 }],
      });
    });

    it('returns referentially equal results given same arg', () => {
      expect(agesWithDup.groupBy('sort_order')).to.equal(agesWithDup.groupBy('sort_order'));
    });

    it('returns referentially unequal results given different args', () => {
      expect(agesWithDup.groupBy('sort_order')).to.not.equal(agesWithDup.groupBy('age_group_id'));
    });
  });

  describe('chained transformations', () => {
    describe('valueBy', () => {
      it('keyed - creates a mapping between two properties', () => {
        expect(ages.keyBy('age_group_id').valueBy('age_group_name')).to.deep.equal({
          1: 'one',
          2: 'two',
        });
      });

      it('grouped - creates a mapping between two properties', () => {
        expect(agesWithDup.groupBy('sort_order').valueBy('age_group_name')).to.deep.equal({
          1: ['one', 'three'],
          2: ['two'],
        });
      });

      it('returns referentially equal results given same arg', () => {
        expect(ages.keyBy('age_group_id').valueBy('age_group_name'))
          .to.equal(ages.keyBy('age_group_id').valueBy('age_group_name'));
      });

      it('returns referentially unequal results given different args', () => {
        expect(ages.keyBy('age_group_id').valueBy('age_group_name'))
          .to.not.equal(ages.keyBy('age_group_id').valueBy('sort_order'));
      });
    });

    describe('pick', () => {
      it('keyed - creates a mapping between a property and a subset of the metatatum', () => {
        expect(ages.keyBy('age_group_id').pick('age_group_name', 'sort_order')).to.deep.equal({
          1: { age_group_name: 'one', sort_order: 1 },
          2: { age_group_name: 'two', sort_order: 2 },
        });
      });

      it('grouped - creates a mapping between a property and a subset of the metatatum', () => {
        expect(agesWithDup.groupBy('sort_order').pick('age_group_id', 'age_group_name')).to.deep.equal({
          1: [{  age_group_id: 1, age_group_name: 'one' }, {  age_group_id: 3, age_group_name: 'three' }],
          2: [{  age_group_id: 2, age_group_name: 'two' }],
        });
      });

      it('returns referentially equal results given same arg', () => {
        expect(ages.keyBy('age_group_id').pick('age_group_name', 'sort_order'))
          .to.equal(ages.keyBy('age_group_id').pick('age_group_name', 'sort_order'));
      });

      it('returns referentially unequal results given different args', () => {
        expect(ages.keyBy('age_group_id').pick('age_group_name', 'sort_order'))
          .to.not.equal(ages.keyBy('age_group_id').pick('sort_order', 'age_group_name'));
      });
    });
  });
});
