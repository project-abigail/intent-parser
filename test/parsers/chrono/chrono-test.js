import assert from 'assert';
import moment from 'moment';
import sinon from 'sinon';
import chrono from '../../../src/parsers/chrono/chrono';

describe('chrono', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  describe('Returns hours in the future only.', () => {
    const fixtures = [
      {
        ref: moment({ hour: 11 }).valueOf(),
        sentence: 'At 5 today.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 17 }).valueOf(),
            end: undefined,
            text: 'At 5 today',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).valueOf(),
        sentence: 'From 7 to 8.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 19 }).valueOf(),
            end: moment({ hour: 20 }).valueOf(),
            text: 'From 7 to 8',
          },
        ],
      },
    ];

    fixtures.forEach(({ ref, sentence, expected }) => {
      it(sentence, () => {
        sandbox.useFakeTimers(ref);

        const dates = chrono.parse(sentence);

        assert(Array.isArray(dates));
        assert.equal(dates.length, expected.length);

        dates.forEach(({ index, start, end, text }, i) => {
          assert.equal(index, expected[i].index);
          assert.equal(start && start.date ? Number(start.date()) :
            undefined, expected[i].start);
          assert.equal(end && end.date ? Number(end.date()) :
            undefined, expected[i].end);
          assert.equal(text, expected[i].text);
        });
      });
    });
  });

  it('still works after few days', () => {
    // we need to compensate the timezone so that the current date is actually
    // Jan 1 1970.
    sandbox.useFakeTimers(new Date().getTimezoneOffset() * 60 * 1000);
    const sentence = 'at 5pm today';
    let [ date ] = chrono.parse(sentence);
    assert.equal(date.start.knownValues.day, 1);

    sandbox.clock.tick(5 * 24 * 60 * 60 * 1000); // 5 days later
    [date] = chrono.parse(sentence);
    assert.equal(date.start.knownValues.day, 6);
  });

  describe('Parses day periods according to CLDR.', () => {
    const fixtures = [
      {
        sentence: 'At midnight tomorrow.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 0 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'At midnight tomorrow',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).valueOf(),
        sentence: 'in the morning tomorrow.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 9 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'in the morning tomorrow',
          },
        ],
      },
      {
        sentence: 'At noon tomorrow.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 12 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'At noon tomorrow',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).valueOf(),
        sentence: 'Tomorrow afternoon.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 15 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'Tomorrow afternoon',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).valueOf(),
        sentence: 'Tomorrow evening.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 18 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'Tomorrow evening',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).valueOf(),
        sentence: 'Tomorrow night.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 22 }).add(1, 'day').valueOf(),
            end: undefined,
            text: 'Tomorrow night',
          },
        ],
      },
    ];

    fixtures.forEach(({ ref, sentence, expected }) => {
      it(sentence, () => {
        sandbox.useFakeTimers(ref || Date.now());
        const dates = chrono.parse(sentence);

        assert(Array.isArray(dates));
        assert.equal(dates.length, expected.length);

        dates.forEach(({ index, start, end, text }, i) => {
          assert.equal(index, expected[i].index);
          assert.equal(start ? Number(start.date()) : undefined,
            expected[i].start);
          assert.equal(end ? Number(end.date()) : undefined,
            expected[i].end);
          assert.equal(text, expected[i].text);
        });
      });
    });
  });
});
