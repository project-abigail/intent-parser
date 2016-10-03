const PATTERNS = {
  en: {
    patterns: [
      /Remind (?:.+?) (?:to|at|on|by|that|about) (.+)/i,
      /Remind (?:.+?) that (?:it|there) is (.+)/i,
    ],
    // @see http://www.unicode.org/cldr/charts/29/summary/en.html#4
    punctuation: /[-‐–—,;:!?.…'‘’"“”()[\]§@*/&#†‡′″]+$/,
  },

  fr: {
    patterns: [
      /Rappelle (?:.+?) de (.+)/i,
      /Rappelle (?:.+?) d'(.+)/i,
      /Rappelle-(?:.+?) de (.+)/i,
      /Rappelle-(?:.+?) d'(.+)/i,
    ],
    punctuation: /[-‐–—,;:!?.…’"“”«»()[\]§@*/&#†‡]+$/,
  },

  ja: {
    patterns: [
      /(.+)を(?:.+)に思い出させて/i,
      /(?:.+)に(.+)を思い出させて/i,
      /(?:.+)は(.+)と言うリマインダーを作成して/i,
    ],
    punctuation: new RegExp(
      `[-‾_＿－‐—―〜・･,，、､;；:：!！?？.．‥…。｡＇‘’"＂“”(（)）\\[［\\]］{｛}｝` +
      `〈〉《》「｢」｣『』【】〔〕‖§¶@＠*＊/／\＼&＆#＃%％‰†‡′″〃※]+$`, 'u'),
  },
};

const p = Object.freeze({
  normalise: Symbol('normalise'),
  parseNoDates: Symbol('parseNoDates'),
  parseMultipleDates: Symbol('parseMultipleDates'),
});

export default class ActionParser {
  parse(obj = { cleaned: '', time: [] }) {
    let action = null;

    if (obj.time === null) {
      // We use the original phrase.
      const text = this[p.normalise](obj.cleaned);
      action = this[p.parseNoDates](text);
    } else if (obj.time.length === 1) {
      // We use the original phrase with the time extracted out.
      const text = this[p.normalise](obj.time[0].processedText);
      action = this[p.parseNoDates](text);
    } else if (obj.time.length > 1) {
      const text = this[p.normalise](obj.cleaned);
      action = this[p.parseMultipleDates](text);
    }

    obj.action = action;

    return Promise.resolve(obj);
  }

  [p.normalise](string = '') {
    return string
    // Strip punctuations.
      .replace(PATTERNS.en.punctuation, '')
      .trim();
  }

  [p.parseNoDates](text = '') {
    let action = null;

    PATTERNS.en.patterns.some((pattern) => {
      const match = pattern.exec(text);

      if (!match) {
        return false;
      }

      action = match[1];
      return true;
    });

    return action;
  }

  [p.parseMultipleDates]() {
    // @todo Implement me.
    console.error('Parsing action with multiple time references is not ' +
      'implemented yet.');
    return null;
  }
}
