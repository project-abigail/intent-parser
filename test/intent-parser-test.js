import assert from 'assert';
import moment from 'moment';
import sinon from 'sinon';
import IntentParser from '../src/intent-parser';

describe('IntentParser', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

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
      {
        sentence: 'Remind Victoria to go to the birthday party on ' +
        'December 6th at 8 p.m.',
        parsed: {
          recipients: ['Victoria'],
          action: 'go to the birthday party',
          confirmation: 'OK, I\'ll remind Victoria to go to the birthday ' +
          'party on December the 6th.',
          due: moment({ month: 11, day: 6, hour: 20 }).valueOf(),
          intent: 'reminder',
        },
      },
      {
        ref: moment({ day: 15 }),
        sentence: 'Remind Julien to go to the swimming pool ' +
        'on the 19th at 2 p.m.',
        parsed: {
          recipients: ['Julien'],
          action: 'go to the swimming pool',
          confirmation: 'OK, I\'ll remind Julien to go to the swimming pool ' +
          'on the 19th.',
          due: moment({ day: 19, hour: 14 }).valueOf(),
          intent: 'reminder',
        },
      },
      {
        ref: moment({ month: 10, day: 15 }),
        sentence: 'Remind Julien to go to the swimming pool ' +
        'on the    12 at 2 p.m.',
        parsed: {
          recipients: ['Julien'],
          action: 'go to the swimming pool',
          confirmation: 'OK, I\'ll remind Julien to go to the swimming pool ' +
          'on December the 12th.',
          due: moment({ month: 11, day: 12, hour: 14 }).valueOf(),
          intent: 'reminder',
        },
      },
      {
        ref: moment({ month: 10, day: 15 }),
        sentence: 'Remind Julien to go to the swimming pool ' +
        'on the first at 2 p.m.',
        parsed: {
          recipients: ['Julien'],
          action: 'go to the swimming pool',
          confirmation: 'OK, I\'ll remind Julien to go to the swimming pool ' +
          'on December the 1st.',
          due: moment({ month: 11, day: 1, hour: 14 }).valueOf(),
          intent: 'reminder',
        },
      },
    ];

    fixtures.forEach(({ ref, sentence, parsed }) => {
      it(sentence, () => {
        if (ref) {
          sandbox.useFakeTimers(Number(ref));
        }

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
