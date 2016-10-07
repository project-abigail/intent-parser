/* global TwitterCldr, TwitterCldrDataBundle */

import moment from 'moment';

const p = Object.freeze({
  // Properties
  time: Symbol('time'),
  users: Symbol('users'),
  listFormatter: Symbol('listFormatter'),

  // Methods
  formatTime: Symbol('formatTime'),
  isToday: Symbol('isToday'),
  isTomorrow: Symbol('isTomorrow'),
  isThisMonth: Symbol('isThisMonth'),
  formatHoursAndMinutes: Symbol('formatHoursAndMinutes'),
});

const PATTERNS = {
  en: {
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
    formatUser: (user) => user,
  },
  ja: {
    formatUser: (user) => user,
  },
};

export default class QueryConfirmation {
  constructor({ due, recipients }) {
    if (typeof TwitterCldr === 'undefined') {
      this[p.listFormatter] = {
        format: (a) => a.join(' and ')
      };
    } else {
      TwitterCldr.set_data(TwitterCldrDataBundle);
      this[p.listFormatter] = new TwitterCldr.ListFormatter();
    }

    this[p.time] = due;
    this[p.users] = recipients;
  }

  confirm(reminder) {
    // We use the users from the original query rather than the found reminder.
    const users = this[p.formatUser](this[p.users]);

    if (!reminder) {
      const time = this[p.formatTime]({ due: this[p.time] });
      return `I can't find anything scheduled for ${users} ${time}.`;
    }

    const action = reminder.action;
    const time = this[p.formatTime](reminder);

    if (users === 'you' || this[p.users].length >= 1) {
      return `${time}, ${users} have the following activity: "${action}".`;
    }

    return `${time}, ${users} has the following activity: "${action}".`;
  }

  [p.formatUser](users) {
    const formattedUsers = users.map(PATTERNS.en.formatUser);
    return this[p.listFormatter].format(formattedUsers);
  }

  [p.formatTime]({ due }) {
    const hour = this[p.formatHoursAndMinutes](due);

    if (this[p.isToday](due)) {
      return `at ${hour} today`;
    } else if (this[p.isTomorrow](due)) {
      return `at ${hour} tomorrow`;
      // @todo Add a pattern here with the weekday if within 7 days.
    } else if (this[p.isThisMonth](due)) {
      const day = moment(due).format('Do');
      return `at ${hour} on the ${day}`;
    }

    const day = moment(due).format('MMMM [the] Do');
    return `at ${hour} on ${day}`;
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
