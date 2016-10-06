export default class QuestionsCleaner {
  clean(obj = { cleaned: '' }) {
    let cleaned = obj.cleaned
      .replace(
        new RegExp('^(?:Tell me ' +
          '|Let me know ' +
          '|Inform me ' +
          '|I want to know ' +
          ')wh(at|ere|en|o)\\b', 'iu'),
        'Wh$1'
      );

    if (cleaned !== obj.cleaned) {
      if (cleaned.match(/^Wh(at|ere|en|o)\b/i)) {
        // Add question mark if it is a question.
        cleaned = cleaned.replace(/\.+$/, '?');
      }
    }

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
