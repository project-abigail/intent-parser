import assert from 'assert';
import ActionParser from '../../src/parsers/action-parser';

describe('ActionParser', () => {
  describe('Extracts an action from a sentence.', () => {
    const fixtures = [
      [
        'Remind me to go out',
        'go out',
      ],
      [
        'Remind Tom that he has a meeting',
        'he has a meeting',
      ],
      [
        'Remind Ben about his meeting',
        'his meeting',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      // No time reference.
      it(output, () => {
        const actionParser = new ActionParser();
        return actionParser.parse({ cleaned: input, time: null })
          .then((result) => {
            assert.equal(result.action, output);
          });
      });

      // 1 time reference.
      it(output, () => {
        const actionParser = new ActionParser();
        return actionParser.parse({ time: [{ processedText: input }] })
          .then((result) => {
            assert.equal(result.action, output);
          });
      });
    });
  });

  describe('Removes any trailing punctuation.', () => {
    const fixtures = [
      [
        'Remind me to go out.',
        'go out',
      ],
      [
        'Remind me to go out!!',
        'go out',
      ],
      [
        'Remind me to go out?!...',
        'go out',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      // No time reference.
      it(output, () => {
        const actionParser = new ActionParser();
        return actionParser.parse({ cleaned: input, time: null })
          .then((result) => {
            assert.equal(result.action, output);
          });
      });

      // 1 time reference.
      it(output, () => {
        const actionParser = new ActionParser();
        return actionParser.parse({ time: [{ processedText: input }] })
          .then((result) => {
            assert.equal(result.action, output);
          });
      });
    });
  });

  describe('Does not work on sentences with many time references.', () => {
    it('2 times references', () => {
      const actionParser = new ActionParser();
      return actionParser.parse({
        cleaned: 'Remind me to go out.',
        time: [
          {},
          {},
        ],
      })
        .then((result) => {
          assert.equal(result.action, null);
        });
    });
  });
});
