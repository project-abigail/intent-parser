// @todo Use a POS tagger and reorganise element in questions:
// * "Tell me where you are." => "Where are you?"
export default class PolitenessCleaner {
  clean(obj = { cleaned: '' }) {
    const cleaned = obj.cleaned
      .replace(
        new RegExp('^(?:' +
          '|Could you please ' +
          '|Please could you ' +
          '|Could you ' +
          '|Would you please ' +
          '|Please would you ' +
          '|Would you ' +
          '|Will you please ' +
          '|Please will you ' +
          '|Will you ' +
          '|Can you please ' +
          '|Please can you ' +
          '|Can you ' +
          '|Please do ' +
          '|Please ' +
          ')?(.)', 'i'),
        // Capitalise the first letter.
        (match, letter) => letter.toUpperCase()
      );

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
