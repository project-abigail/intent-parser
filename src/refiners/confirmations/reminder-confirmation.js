/* global TwitterCldr, TwitterCldrDataBundle */

import moment from 'moment';

/*
 * @todo:
 *   * @see http://www.unicode.org/cldr/charts/29/verify/dates/en.html
 *     for formatting the time of the day.
 */

const p = Object.freeze({
  // Properties
  listFormatter: Symbol('listFormatter'),

  // Methods
  getLocalised: Symbol('getLocalised'),
  formatUser: Symbol('formatUser'),
  formatAction: Symbol('formatAction'),
  formatTime: Symbol('formatTime'),
  isToday: Symbol('isToday'),
  isTomorrow: Symbol('isTomorrow'),
  isThisMonth: Symbol('isThisMonth'),
  formatHoursAndMinutes: Symbol('formatHoursAndMinutes'),
});

const DEFAULT_LOCALE = 'en';
const PATTERNS = {
  en: {
    template: `OK, I'll remind [users] [action] [time].`,
    formatUser: (user) => user
      .replace(/\bme\b/gi, 'you')
      .replace(/\bI am\b/gi, 'you are')
      .replace(/\bI have\b/gi, 'you have')
      .replace(/\bI will\b/gi, 'you will')
      .replace(/\bI\b/gi, 'you')
      .replace(/\bmy\b/gi, 'your')
      .replace(/\bmine\b/gi, 'yours'),
  },
  fr: {
    template: `OK, je rappelerai [users] [action] [time].`,
    formatUser: (user) => user,
  },
  ja: {
    template: `承知しました。[time][users]に[action]をリマインドします。`,
    formatUser: (user) => user,
  },
};

export default class ReminderConfirmation {
  constructor(locale = DEFAULT_LOCALE) {
    this.locale = locale;

    if (TwitterCldr !== undefined) {
      TwitterCldr.set_data(TwitterCldrDataBundle);
      this[p.listFormatter] = new TwitterCldr.ListFormatter();
    } else {
      this[p.listFormatter] = {
        format: (a) => a.join(' and ')
      };
    }
  }

  /**
   * Generate a phrase to be spoken to confirm a reminder.
   *
   * @param {Object} reminder
   * @return {string}
   */
  confirm(reminder) {
    const template = this[p.getLocalised]('template');
    const data = {
      users: this[p.formatUser](reminder),
      action: this[p.formatAction](reminder),
      time: this[p.formatTime](reminder),
    };

    return template.replace(/\[([^\]]+)\]/g, (match, placeholder) => {
      return data[placeholder];
    });
  }

  /**
   * Given a property of the PATTERNS object, returns the one matching the
   * current locale or the default one if non existing.
   *
   * @param {string} prop
   * @returns {*}
   */
  [p.getLocalised](prop) {
    let locale = this.locale;
    if (!PATTERNS[this.locale] || !PATTERNS[this.locale][prop]) {
      locale = DEFAULT_LOCALE;
    }

    return PATTERNS[locale][prop];
  }

  [p.formatUser]({ recipients }) {
    const formatUser = this[p.getLocalised]('formatUser');
    const formattedUsers = recipients.map(formatUser);
    return this[p.listFormatter].format(formattedUsers);
  }

  [p.formatAction]({ action, cleaned }) {
    const formatUser = this[p.getLocalised]('formatUser');
    const formattedAction = formatUser(action);

    const PATTERN1 = new RegExp(`\\bthat ${action}`, 'iu');
    const PATTERN2 = new RegExp(`\\bit is ${action}`, 'iu');
    const PATTERN3 = new RegExp(`\\bthere is ${action}`, 'iu');
    const PATTERN4 = new RegExp(`\\babout ${action}`, 'iu');

    if (PATTERN1.test(cleaned)) {
      return `that ${formattedAction}`;
    } else if (PATTERN2.test(cleaned)) {
      return `that it is ${formattedAction}`;
    } else if (PATTERN3.test(cleaned)) {
      return `that there is ${formattedAction}`;
    } else if (PATTERN4.test(cleaned)) {
      return `about ${formattedAction}`;
    }

    return `to ${formattedAction}`;
  }

  [p.formatTime]({ due }) {
    if (this[p.isToday](due)) {
      const hour = this[p.formatHoursAndMinutes](due);
      return `at ${hour} today`;
    } else if (this[p.isTomorrow](due)) {
      const hour = this[p.formatHoursAndMinutes](due);
      return `at ${hour} tomorrow`;
      // @todo Add a pattern here with the weekday if within 7 days.
    } else if (this[p.isThisMonth](due)) {
      return moment(due).format('[on the] Do');
    }

    return moment(due).format('[on] MMMM [the] Do');
  }

  [p.isToday](date) {
    const today = moment().startOf('day');
    const tomorrow = moment().add(1, 'day').startOf('day');
    return moment(date).isBetween(today, tomorrow);
  }

  [p.isTomorrow](date) {
    const tomorrow = moment().add(1, 'day').startOf('day');
    const in2days = moment().add(2, 'day').startOf('day');
    return moment(date).isBetween(tomorrow, in2days);
  }

  [p.isThisMonth](date) {
    const thisMonth = moment().startOf('month');
    const nextMonth = moment().add(1, 'month').startOf('month');
    return moment(date).isBetween(thisMonth, nextMonth);
  }

  /**
   * Return a string from a date suitable for speech synthesis.
   *
   * @param {Date} date
   * @return {string}
   */
  [p.formatHoursAndMinutes](date) {
    date = moment(date);
    let format;

    if (date.minute() === 0) {
      format = date.format('h A'); // 7 PM
    } else if (date.minute() === 15) {
      format = date.format('[quarter past] h A');
    } else if (date.minute() === 30) {
      format = date.format('[half past] h A');
    } else if (date.minute() === 45) {
      const nextHour = date.add(1, 'hour');
      format = nextHour.format('[quarter to] h A');
    } else {
      format = date.format('h:m A'); // 6:24 AM
    }

    // Some speech synthesisers pronounce "AM" as in "ham" (not "A. M.").
    return format
      .replace(/([0-9]) ?AM$/gi, '$1 A.M.')
      .replace(/([0-9]) ?PM$/gi, '$1 P.M.');
  }
}
