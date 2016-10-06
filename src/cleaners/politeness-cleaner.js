// @todo Use a POS tagger and reorganise element in questions:
// * "Tell me where you are." => "Where are you?"
export default class PolitenessCleaner {
  clean(obj = { cleaned: '' }) {
    const cleaned = obj.cleaned
      .replace(
        new RegExp('^(?:Can you please ' +
          '|Please can you ' +
          '|Can you ' +
          '|Will you please ' +
          '|Please will you ' +
          '|Will you ' +
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
