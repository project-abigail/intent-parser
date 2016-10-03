// @todo Use a POS tagger and reorganise element in questions:
// * "Tell me where you are." => "Where are you?"
export default class PolitenessCleaner {
  clean(obj = { cleaned: '' }) {
    let cleaned = obj.cleaned
      .replace(new RegExp('^(?:Can you ' +
          '|Can you please ' +
          '|Please can you ' +
          '|Please ' +
          '|Please do ' +
          ')?remind\\b', 'i'),
        'Remind')
      .replace(new RegExp('^(?:Can you tell me ' +
          '|Can you please tell me ' +
          '|Please tell me ' +
          '|Please do tell me ' +
          '|Tell me ' +
          ')?wh(at|ere|en)\\b', 'i'),
        'Wh$1');

    if (cleaned !== obj.cleaned) {
      if (cleaned.match(/^Remind\b/i)) {
        // Remove question mark if it was a question.
        cleaned = cleaned.replace(/\?+$/, '.');
      } else if (cleaned.match(/^Wh(at|ere|en)\b/i)) {
        // Add question mark if it is a question.
        cleaned = cleaned.replace(/\.+$/, '?');
      }
    }

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
