const PATTERNS = {
  en: {
    patterns: [
      /^Remind (.+?) (?:to|at|on|by|that|about)\b/i,
      /^Where (?:am|are|is) (.+?) (?:at|on|by)\b/i,
      /^Where (?:am|are|is) (.+?) supposed to\b/i,
      /^Where should (.+?) go\b/i,
      /^What (?:am|are|is) (.+?) doing\b/i,
      /^What (?:am|are|is) (.+?) supposed to\b/i,
      /^What should (.+?) do\b/i,
      /^What (?:do|does) (.+?) do\b/i,
      /^What is (.+?)(?:'s)? (?:schedule|planning|calendar|agenda)\b/i,
      /([^ ]+ (?:and|&) [^ ]+)/i, // @todo Improve with more patterns.
    ],
    // @see http://www.unicode.org/cldr/charts/29/summary/en.html#6402
    listBreaker: /,? (?:and|&) |, /gi,
  },

  fr: {
    patterns: [
      /Rappelle (.+?) de (?:.+)/i,
      /Rappelle (.+?) d'(?:.+)/i,
      /Rappelle-(.+?) de (?:.+)/i,
      /Rappelle-(.+?) d'(?:.+)/i,
    ],
    listBreaker: /,? (?:et|&) |, /gi,
  },

  ja: {
    patterns: [
      /(?:.+)を(.+)に思い出させて/i,
      /(.+)に(?:.+)を思い出させて/i,
      /(.+)は(?:.+)と言うリマインダーを作成して/i,
    ],
    listBreaker: new RegExp(`、`, 'gu'),
  },
};

const p = Object.freeze({
  users: Symbol('users'),
  normalise: Symbol('normalise'),
  parseUsers: Symbol('parseUsers'),
});

// @todo Import and use the list of users when multiusers db is ready.
export default class UsersParser {
  constructor(users = []) {
    this[p.users] = users;
  }

  parse(obj = { cleaned: '' }) {
    const text = obj.cleaned;
    let users = null;

    PATTERNS.en.patterns.some((pattern) => {
      const match = pattern.exec(text);

      if (!match) {
        return false;
      }

      users = this[p.parseUsers](match[1]);
      return !!users.length;
    });

    obj.recipients = users;

    return Promise.resolve(obj);
  }

  [p.parseUsers](string = '') {
    return string
      .split(PATTERNS.en.listBreaker)
      .map((user) => user.trim())
      .filter((user) => !!user);
  }
}
