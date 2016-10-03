export default class ContractionsCleaner {
  clean(obj = { cleaned: '' }) {
    const cleaned = obj.cleaned
    // Unambiguous cases.
      .replace(/\b(let)'s\b/ig, '$1 us') // Keep the case.
      .replace(/'s (been|got|gotten)\b/ig, ' has $1')
      .replace(/'s (being|going)\b/ig, ' is $1')
      .replace(/'d (like|love)\b/ig, ' would $1')

      // Irregular negations.
      .replace(/\b(should)n't've\b/ig, '$1 not have')
      .replace(/\b(would)n't've\b/ig, '$1 not have')
      .replace(/\b(could)n't've\b/ig, '$1 not have')
      .replace(/\b(s)han't\b/ig, '$1hall not') // Keep the first letter case.
      .replace(/\b(w)on't\b/ig, '$1ill not')
      .replace(/\b(c)an't\b/ig, '$1annot')

      // Regular contractions.
      .replace(new RegExp('\\b(' +
        'am|are|could|did|do|does|had|has|have|' +
        'is|might|must|should|was|were|would' +
        ')n\'t\\b', 'ig'), '$1 not')
      .replace(/\b(g)onna\b/ig, '$1oing to') // Keep the first letter case.
      .replace(/\b(w)anna\b/ig, '$1ant to')
      .replace(/'ll\b/ig, ' will')
      .replace(/'re\b/ig, ' are')
      .replace(/'ve\b/ig, ' have')
      .replace(/'m\b/ig, ' am');

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  }
}
