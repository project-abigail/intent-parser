import assert from 'assert';
import UsersParser from '../../src/parsers/users-parser';

describe('UsersParser', () => {
  describe('Extracts users from a sentence.', () => {
    const fixtures = [
      [
        'Remind me to buy milk',
        ['me'],
      ],
      [
        'Remind Tom about the meeting',
        ['Tom'],
      ],
      [
        'Where is Sandra at 9 PM tonight?',
        ['Sandra'],
      ],
      [
        'Where should I go?',
        ['I'],
      ],
      [
        'What are they doing?',
        ['they'],
      ],
      [
        'What should we do?',
        ['we'],
      ],
      [
        'What is my planning for tonight?',
        ['my'],
      ],
      [
        'What is Sarah\'s schedule for tonight?',
        ['Sarah'],
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(JSON.stringify(output), () => {
        const usersParser = new UsersParser();
        return usersParser.parse({ cleaned: input })
          .then((result) => {
            assert.deepEqual(result.recipients, output);
          });
      });
    });
  });

  describe('#parseUsers() processes list of users.', () => {
    const fixtures = [
      [
        'Tom',
        ['Tom'],
      ],
      [
        'Tom and Jerry',
        ['Tom', 'Jerry'],
      ],
      [
        'Tom & Jerry',
        ['Tom', 'Jerry'],
      ],
      [
        'Huey, Dewey and Louie',
        ['Huey', 'Dewey', 'Louie'],
      ],
      [
        'Huey, Dewey & Louie',
        ['Huey', 'Dewey', 'Louie'],
      ],
      [
        'Huey, Dewey, and Louie', // Serial comma
        ['Huey', 'Dewey', 'Louie'],
      ],
      [
        'Huey, Dewey, & Louie', // Serial comma
        ['Huey', 'Dewey', 'Louie'],
      ],
    ];

    fixtures.forEach(([input, output]) => {
      it(input, () => {
        const usersParser = new UsersParser();
        const result = usersParser.parseUsers(input);

        assert.deepEqual(result, output);
      });
    });
  });
});
