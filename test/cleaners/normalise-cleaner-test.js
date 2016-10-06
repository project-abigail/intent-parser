import assert from 'assert';
import NormaliseCleaner from '../../src/cleaners/normalise-cleaner';

describe('NormaliseCleaner', () => {
  describe('Collapses whitespaces and trims inputs.', () => {
    const fixtures = [
      [
        '   a   b   c   ',
        'a b c',
      ],
      [
        '\t a \t b \t c \t',
        'a b c',
      ],
      [
        '\n a \n b \n c \n',
        'a b c',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const normaliseCleaner = new NormaliseCleaner();
        return normaliseCleaner.clean({ raw: input }).then((result) => {
          assert.equal(result.text, output);
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
