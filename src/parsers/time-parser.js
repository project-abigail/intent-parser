import chrono from './chrono/chrono';

const p = Object.freeze({
  normaliseTimes: Symbol('normaliseTimes'),
});

/**
 * Current bugs about time extraction from the original text:
 *
 * * When a time frame is set, the "from" should be extracted too.
 *   e.g. "I'm busy from Mon to Tue" => "I'm busy from"
 *
 * * When multiple dates are specified, they should all be removed.
 *   e.g. "I'm busy on Wed and Thurs" =>
 *        ["I'm busy on and Thurs", "I'm busy on Wed and"]
 */
export default class TimeParser {
  parse(obj = { cleaned: '' }) {
    const text = this[p.normaliseTimes](obj.cleaned);
    const dates = chrono.parse(text);

    if (!dates.length) {
      obj.time = null;
      return Promise.resolve(obj);
    }

    const time = dates.map((date) => {
      const start = date.start ? Number(date.start.date()) : null;
      const end = date.end ? Number(date.end.date()) : null;
      const extractedText = date.text;
      let beforeText = text.substr(0, date.index).trim();
      const afterText = text.substr(date.index + extractedText.length).trim();

      // temporary fix for https://github.com/wanasit/chrono/issues/152
      if (/\b(?:on|by)$/.test(beforeText)) {
        beforeText = beforeText.slice(0, -3);
      }

      const processedText = `${beforeText} ${afterText}`;

      return { start, end, extractedText, processedText };
    });

    obj.time = time;

    return Promise.resolve(obj);
  }

  [p.normaliseTimes](text = '') {
    // The Web Speech API returns PM hours as `p.m.`.
    return text
      .replace(/([0-9]) ?p\.m\./gi, '$1 PM')
      .replace(/([0-9]) ?a\.m\./gi, '$1 AM');
  }
}
