import assert from 'assert';
import chrono from '../src/parsers/chrono/chrono';
import moment from 'moment';
import IntentParser from '../src/intent-parser';

describe('intent-parser', () => {
  describe('Properly parses expected reminder sentences.', () => {
    const fixtures = [
      {
        sentence: 'Remind me to go to the office at 5pm.',
        parsed: {
          recipients: ['me'],
          action: 'go to the office',
          confirmation: 'OK, I\'ll remind you to go to the office at ' +
          '5 P.M. today.',
          due: moment({ hour: 17 }).toDate().getTime(),
          intent: 'reminder',
        },
      },
      {
        sentence: 'Remind John to take out trash tomorrow!',
        parsed: {
          recipients: ['John'],
          action: 'take out trash',
          confirmation: 'OK, I\'ll remind John to take out trash at ' +
          '12 P.M. tomorrow.',
          due: moment({ hour: 12 }).add(1, 'day').toDate().getTime(),
          intent: 'reminder',
        },
      },
      {
        sentence: 'Hey!! Please can you remind Tom and Jerry that ' +
        'they\'ve got a meeting at 1 today?',
        parsed: {
          recipients: ['Tom', 'Jerry'],
          action: 'they have got a meeting',
          confirmation: 'OK, I\'ll remind Tom and Jerry that ' +
          'they have got a meeting at 1 P.M. today.',
          due: moment({ hour: 13 }).toDate().getTime(),
          intent: 'reminder',
        },
      },
      {
        sentence: 'What is Sandra doing on Wednesday night?',
        parsed: {
          recipients: ['Sandra'],
          action: null,
          confirmation: () => {
          },
          // Always next Wednesday.
          due: moment({ hour: 22 }).day(3).isBefore(moment({ hour: 22 })) ?
            moment({ hour: 22 }).day(10).toDate().getTime() :
            moment({ hour: 22 }).day(3).toDate().getTime(),
          intent: 'query',
        },
      },
    ];

    fixtures.forEach(({ sentence, parsed }) => {
      it(sentence, () => {
        chrono.setRef(new Date());
        const intentParser = new IntentParser();
        return intentParser.parse(sentence).then((result) => {
          assert.deepEqual(result.recipients, parsed.recipients);
          assert.equal(result.action, parsed.action);
          if (typeof parsed.confirmation === 'string') {
            assert.equal(result.confirmation, parsed.confirmation);
          } else {
            assert.equal(typeof result.confirmation, 'function');
          }
          assert.equal(result.due, parsed.due);
          assert.equal(result.intent, parsed.intent);
        });
      });
    });
  });
});
