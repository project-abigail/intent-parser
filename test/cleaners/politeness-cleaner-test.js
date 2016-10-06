import assert from 'assert';
import PolitenessCleaner from '../../src/cleaners/politeness-cleaner';

describe('PolitenessCleaner', () => {
  describe('Removes expressions of politeness.', () => {
    const fixtures = [
      [
        'Can you remind me of something',
        'Remind me of something',
      ],
      [
        'Can you please remind me of something',
        'Remind me of something',
      ],
      [
        'Please remind me of something',
        'Remind me of something',
      ],
      [
        'Please do remind me of something',
        'Remind me of something',
      ],
      [
        'Will you remind me of something',
        'Remind me of something',
      ],
      [
        'Will you please remind me of something',
        'Remind me of something',
      ],
      [
        'Can you tell me what do I do',
        'What do I do',
      ],
      [
        'Can you please tell me where do I go',
        'Where do I go',
      ],
      [
        'Tell me what do I do',
        'What do I do',
      ],
      [
        'Tell me when do I have to go',
        'When do I have to go',
      ],
      [
        'Will you tell me when do I have to go',
        'When do I have to go',
      ],
      [
        'Will you please tell me when do I have to go',
        'When do I have to go',
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

  describe('Adds or removes a question mark if the phrase was changed.', () => {
    const fixtures = [
      // Completely unchanged.
      [
        'Remind me about an appointment.',
        'Remind me about an appointment.',
      ],
      [
        'What are you doing?',
        'What are you doing?',
      ],
      // Punctuation unchanged.
      [
        'Please remind me about an appointment.',
        'Remind me about an appointment.',
      ],
      [
        'Tell me what are you doing?',
        'What are you doing?',
      ],
      // Remove the question mark.
      [
        'Please can you remind me what to do?',
        'Remind me what to do.',
      ],
      [
        'Can you remind me where to go?',
        'Remind me where to go.',
      ],
      // Add a question mark.
      [
        'Please tell me where do we go.',
        'Where do we go?',
      ],
      [
        'Tell me what are you doing.',
        'What are you doing?',
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
