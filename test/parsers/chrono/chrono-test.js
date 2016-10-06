import assert from 'assert';
import moment from 'moment';
import chrono from '../../../src/parsers/chrono/chrono';

describe('chrono', function() {
  describe('Returns hours in the future only.', function() {
    const fixtures = [
      {
        ref: moment({ hour: 11 }).toDate(),
        sentence: 'At 5 today.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 17 }).toDate().getTime(),
            end: undefined,
            text: 'At 5 today',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).toDate(),
        sentence: 'From 7 to 8.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 19 }).toDate().getTime(),
            end: moment({ hour: 20 }).toDate().getTime(),
            text: 'From 7 to 8',
          },
        ],
      },
    ];

    fixtures.forEach(({ ref, sentence, expected }) => {
      it(sentence, function() {
        chrono.setRef(ref);
        const dates = chrono.parse(sentence);

        assert.isArray(dates);
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

  describe('Parses day periods according to CLDR.', function() {
    const fixtures = [
      {
        sentence: 'At midnight tomorrow.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 0 }).add(1, 'day').toDate().getTime(),
            end: undefined,
            text: 'At midnight tomorrow',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).toDate(),
        sentence: 'in the morning tomorrow.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 9 }).add(1, 'day').toDate().getTime(),
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
            start: moment({ hour: 12 }).add(1, 'day').toDate().getTime(),
            end: undefined,
            text: 'At noon tomorrow',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).toDate(),
        sentence: 'Tomorrow afternoon.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 15 }).add(1, 'day').toDate().getTime(),
            end: undefined,
            text: 'Tomorrow afternoon',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).toDate(),
        sentence: 'Tomorrow evening.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 19 }).add(1, 'day').toDate().getTime(),
            end: undefined,
            text: 'Tomorrow evening',
          },
        ],
      },
      {
        ref: moment({ hour: 9 }).toDate(),
        sentence: 'Tomorrow night.',
        expected: [
          {
            index: 0,
            start: moment({ hour: 22 }).add(1, 'day').toDate().getTime(),
            end: undefined,
            text: 'Tomorrow night',
          },
        ],
      },
    ];

    fixtures.forEach(({ ref, sentence, expected }) => {
      it(sentence, function() {
        chrono.setRef(ref || new Date());
        const dates = chrono.parse(sentence);

        assert.isArray(dates);
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
