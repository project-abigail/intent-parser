import assert from 'assert';
import SalutationsCleaner from '../../src/cleaners/salutations-cleaner';

describe('SalutationsCleaner', () => {
  describe('Removes salutations at the beginning of phrases.', () => {
    const fixtures = [
      [
        'Hello how are you?',
        'How are you?',
      ],
      [
        'Hey how are you?',
        'How are you?',
      ],
      [
        'Hi how are you?',
        'How are you?',
      ],
      [
        'Yo how are you?',
        'How are you?',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const salutationsCleaner = new SalutationsCleaner();
        return salutationsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });

  describe('Removes leading salutations and punctuations from phrases.', () => {
    const fixtures = [
      [
        'Hey! How are you?',
        'How are you?',
      ],
      [
        'Hey, how are you?',
        'How are you?',
      ],
      [
        'Hey!! how are you?',
        'How are you?',
      ],
      [
        'Hey. How are you?',
        'How are you?',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const salutationsCleaner = new SalutationsCleaner();
        return salutationsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
