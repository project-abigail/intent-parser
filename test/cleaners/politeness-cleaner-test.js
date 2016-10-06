import assert from 'assert';
import PolitenessCleaner from '../../src/cleaners/politeness-cleaner';

describe('PolitenessCleaner', () => {
  describe('Removes expressions of politeness.', () => {
    const fixtures = [
      [
        'Can you please remind me of something',
        'Remind me of something',
      ],
      [
        'Please can you remind me of something',
        'Remind me of something',
      ],
      [
        'Can you remind me of something',
        'Remind me of something',
      ],
      [
        'Will you please remind me of something',
        'Remind me of something',
      ],
      [
        'Please will you remind me of something',
        'Remind me of something',
      ],
      [
        'Will you remind me of something',
        'Remind me of something',
      ],
      [
        'Please do remind me of something',
        'Remind me of something',
      ],
      [
        'Please remind me of something',
        'Remind me of something',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const politenessCleaner = new PolitenessCleaner();
        return politenessCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
