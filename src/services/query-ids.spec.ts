import { queryIds } from './query-ids';

describe('queryIds', () => {
  it('reads repeated ids as they are', () => {
    expect(queryIds(['1', '2'])).toEqual(['1', '2']);
  });

  it('reads a single id as a one-element array', () => {
    expect(queryIds('36215311')).toEqual(['36215311']);
  });

  it('splits comma separated ids, as the Swagger description says', () => {
    expect(queryIds('1, 2,,3')).toEqual(['1', '2', '3']);
  });

  it('leaves a missing parameter missing', () => {
    expect(queryIds(undefined)).toBeUndefined();
  });
});
