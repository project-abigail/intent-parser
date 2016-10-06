import assert from 'assert';
import ContractionsCleaner from '../../src/cleaners/contractions-cleaner';

describe('ContractionsCleaner', () => {
  describe('Removes English contractions when not ambiguous.', () => {
    const fixtures = [
      [
        'Let\'s dance.',
        'Let us dance.',
      ],
      [
        'She\'s got a ticket to ride.',
        'She has got a ticket to ride.',
      ],
      [
        'I said hey, what\'s going on?',
        'I said hey, what is going on?',
      ],
      [
        'Children\'s reading activities',
        'Children\'s reading activities', // Must remain unchanged.
      ],
      [
        'Because I can\'t not ♫',
        'Because I cannot not ♫',
      ],
      [
        'I don\'t wanna dissect everything today',
        'I do not want to dissect everything today',
      ],
      [
        'That was me and I\'m not gonna fade',
        'That was me and I am not going to fade',
      ],
      [
        'I\'ll survive!',
        'I will survive!',
      ],
      [
        'Thunderbirds\'re go!',
        'Thunderbirds are go!',
      ],
      [
        'You\'ve got mail.',
        'You have got mail.',
      ],
      [
        'I\'m what I\'m!',
        'I am what I am!',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const contractionsCleaner = new ContractionsCleaner();
        return contractionsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });

  describe('Keeps the case of the first letters.', () => {
    const fixtures = [
      [
        'Let\'s Dance',
        'Let us Dance',
      ],
      [
        'let\'s dance',
        'let us dance',
      ],
      [
        'I Can\'t Get No Satisfaction',
        'I Cannot Get No Satisfaction',
      ],
      [
        'I can\'t get no satisfaction',
        'I cannot get no satisfaction',
      ],
      [
        'I would throw a party still it wouldn\'t come',
        'I would throw a party still it would not come',
      ],
      [
        'I Would Throw a Party Still It Wouldn\'t Come',
        'I Would Throw a Party Still It Would not Come',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const contractionsCleaner = new ContractionsCleaner();
        return contractionsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
