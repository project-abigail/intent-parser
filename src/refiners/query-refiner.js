// @todo Handle the case where a time range is specified.
export default class QueryRefiner {
  /**
   * A query is an intent that:
   *  * Looks like a question
   *  * Has a single time reference
   *  * Has at least 1 user
   *  * Has no actions
   *
   * @param {Object} obj
   * @returns {Promise}
   */
  refine(obj = {}) {
    const hasTime = obj.time !== null
      && obj.time.length === 1
      && obj.time[0].start !== null
      && obj.time[0].end === null;
    const hasUsers = obj.recipients !== null
      && obj.recipients.length > 0;
    const hasNoActions = obj.action === null;

    if (obj.cleaned.match(/^(?:What|Where)/i)
      && hasTime
      && hasUsers
      && hasNoActions) {
      obj.due = obj.time[0].start;
      obj.intent = 'query';
    }

    return Promise.resolve(obj);
  }
}
