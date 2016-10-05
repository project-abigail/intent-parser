import QueryConfirmation from './confirmations/query-confirmation';

const PATTERNS = {
  en: {
    formatUser: (user) => user
      .replace(/\bI\b/gi, 'me')
      .replace(/\bmy\b/gi, 'me')
      .replace(/\bmine\b/gi, 'me'),
  },
  fr: {
    formatUser: (user) => user,
  },
  ja: {
    formatUser: (user) => user,
  },
};

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

    if (obj.cleaned.match(/^(?:What|Where|When)/i)
      && hasTime
      && hasUsers
      && hasNoActions) {
      const queryConfirmation = new QueryConfirmation({
        due: obj.time[0].start,
        recipients: obj.recipients,
      });

      obj.due = obj.time[0].start;
      obj.recipients = obj.recipients.map(PATTERNS.en.formatUser);
      obj.confirmation = queryConfirmation.confirm.bind(queryConfirmation);
      obj.intent = 'query';
    }

    return Promise.resolve(obj);
  }
}
