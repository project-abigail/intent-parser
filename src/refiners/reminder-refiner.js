import ReminderConfirmation from './confirmations/reminder-confirmation';

const p = Object.freeze({
  reminderConfirmation: Symbol('reminderConfirmation'),
});

export default class ReminderRefiner {
  constructor() {
    this[p.reminderConfirmation] = new ReminderConfirmation();
  }

  /**
   * A reminder is an intent that:
   *  * Starts with "Remind"
   *  * Has a single time reference
   *  * Has at least 1 user
   *  * Has an action
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
    const hasAction = obj.action !== null;

    if (obj.cleaned.toLowerCase().startsWith('remind')
      && hasTime
      && hasUsers
      && hasAction) {
      obj.due = obj.time[0].start;
      obj.confirmation = this[p.reminderConfirmation].confirm(obj);
      obj.intent = 'reminder';
    }

    return Promise.resolve(obj);
  }
}
