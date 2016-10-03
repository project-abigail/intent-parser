export default class NormaliseCleaner {
  clean(obj = { raw: '' }) {
    const text = obj.raw
    // Normalise whitespace to space.
      .replace(/\s+/g, ' ')
      .trim();

    // Let's use the normalised text for the rest of the processing.
    obj.text = text;
    obj.cleaned = text;

    return Promise.resolve(obj);
  }
}
