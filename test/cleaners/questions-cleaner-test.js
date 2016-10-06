import assert from 'assert';
import QuestionsCleaner from '../../src/cleaners/questions-cleaner';

describe('QuestionsCleaner', () => {
  describe('Leaves interrogative words.', () => {
    const fixtures = [
      [
        'Tell me what do I do',
        'What do I do',
      ],
      [
        'Tell me where do I go',
        'Where do I go',
      ],
      [
        'Tell me when do I have to go',
        'When do I have to go',
      ],
      [
        'Let me know what do I do',
        'What do I do',
      ],
      [
        'Let me know where do I go',
        'Where do I go',
      ],
      [
        'Let me know when do I have to go',
        'When do I have to go',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const questionsCleaner = new QuestionsCleaner();
        return questionsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });

  describe('Adds a question mark if the phrase was changed.', () => {
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
        'Tell me what are you doing?',
        'What are you doing?',
      ],
      [
        'Let me know what are you doing?',
        'What are you doing?',
      ],
      // Add a question mark.
      [
        'Tell me where do we go.',
        'Where do we go?',
      ],
      [
        'Tell me what are you doing.',
        'What are you doing?',
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(output, () => {
        const questionsCleaner = new QuestionsCleaner();
        return questionsCleaner.clean({ cleaned: input }).then((result) => {
          assert.equal(result.cleaned, output);
        });
      });
    });
  });
});
