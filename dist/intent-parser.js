(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('chrono-node'), require('moment')) :
  typeof define === 'function' && define.amd ? define(['chrono-node', 'moment'], factory) :
  (global.IntentParser = factory(global.chrono,global.moment));
}(this, (function (chrono,moment) { 'use strict';

chrono = 'default' in chrono ? chrono['default'] : chrono;
moment = 'default' in moment ? moment['default'] : moment;

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};









var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var NormaliseCleaner = function () {
  function NormaliseCleaner() {
    classCallCheck(this, NormaliseCleaner);
  }

  NormaliseCleaner.prototype.clean = function clean() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { raw: '' };

    var text = obj.raw
    // Normalise whitespace to space.
    .replace(/\s+/g, ' ').trim();

    // Let's use the normalised text for the rest of the processing.
    obj.text = text;
    obj.cleaned = text;

    return Promise.resolve(obj);
  };

  return NormaliseCleaner;
}();

var ContractionsCleaner = function () {
  function ContractionsCleaner() {
    classCallCheck(this, ContractionsCleaner);
  }

  ContractionsCleaner.prototype.clean = function clean() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '' };

    var cleaned = obj.cleaned
    // Unambiguous cases.
    .replace(/\b(let)'s\b/ig, '$1 us') // Keep the case.
    .replace(/'s (been|got|gotten)\b/ig, ' has $1').replace(/'s (being|going)\b/ig, ' is $1').replace(/'d (like|love)\b/ig, ' would $1')

    // Irregular negations.
    .replace(/\b(should)n't've\b/ig, '$1 not have').replace(/\b(would)n't've\b/ig, '$1 not have').replace(/\b(could)n't've\b/ig, '$1 not have').replace(/\b(s)han't\b/ig, '$1hall not') // Keep the first letter case.
    .replace(/\b(w)on't\b/ig, '$1ill not').replace(/\b(c)an't\b/ig, '$1annot')

    // Regular contractions.
    .replace(new RegExp('\\b(' + 'am|are|could|did|do|does|had|has|have|' + 'is|might|must|should|was|were|would' + ')n\'t\\b', 'ig'), '$1 not').replace(/\b(g)onna\b/ig, '$1oing to') // Keep the first letter case.
    .replace(/\b(w)anna\b/ig, '$1ant to').replace(/'ll\b/ig, ' will').replace(/'re\b/ig, ' are').replace(/'ve\b/ig, ' have').replace(/'m\b/ig, ' am');

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  };

  return ContractionsCleaner;
}();

var PUNCTUATION = {
  // @see http://www.unicode.org/cldr/charts/29/summary/en.html#4
  en: '[-‐–—,;:!?.…\'‘’"“”()[\\]§@*/&#†‡′″]',
  fr: '[-‐–—,;:!?.…’"“”«»()[\\]§@*/&#†‡]',
  ja: '[-‾_＿－‐—―〜・･,，、､;；:：!！?？.．‥…。｡＇‘’"＂“”(（)）\\[［\\]］{｛}｝' + '〈〉《》「｢」｣『』【】〔〕‖§¶@＠*＊/／\\＼&＆#＃%％‰†‡′″〃※]'
};

var SalutationsCleaner = function () {
  function SalutationsCleaner() {
    classCallCheck(this, SalutationsCleaner);
  }

  SalutationsCleaner.prototype.clean = function clean() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '' };

    var cleaned = obj.cleaned.replace(new RegExp('^(?:Hello|Hey|Hi|Yo)' + PUNCTUATION.en + '* ', 'iu'), '');

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  };

  return SalutationsCleaner;
}();

// @todo Use a POS tagger and reorganise element in questions:
// * "Tell me where you are." => "Where are you?"
var PolitenessCleaner = function () {
  function PolitenessCleaner() {
    classCallCheck(this, PolitenessCleaner);
  }

  PolitenessCleaner.prototype.clean = function clean() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '' };

    var cleaned = obj.cleaned.replace(new RegExp('^(?:Can you ' + '|Can you please ' + '|Please can you ' + '|Please ' + '|Please do ' + ')?remind\\b', 'i'), 'Remind').replace(new RegExp('^(?:Can you tell me ' + '|Can you please tell me ' + '|Please tell me ' + '|Please do tell me ' + '|Tell me ' + ')?wh(at|ere|en)\\b', 'i'), 'Wh$1');

    if (cleaned !== obj.cleaned) {
      if (cleaned.match(/^Remind\b/i)) {
        // Remove question mark if it was a question.
        cleaned = cleaned.replace(/\?+$/, '.');
      } else if (cleaned.match(/^Wh(at|ere|en)\b/i)) {
        // Add question mark if it is a question.
        cleaned = cleaned.replace(/\.+$/, '?');
      }
    }

    obj.cleaned = cleaned;

    return Promise.resolve(obj);
  };

  return PolitenessCleaner;
}();

/**
 * Parse day periods according to CLDR.
 * @see http://www.unicode.org/cldr/charts/29/verify/dates/en.html
 */
var dayPeriodsParser = new chrono.Parser();
dayPeriodsParser.pattern = function () {
  return new RegExp('midnight|morning|in the morning|noon|' + 'afternoon|in the afternoon|evening|in the evening|night|at night', 'i');
};
dayPeriodsParser.extract = function (text, ref, match) {
  var hour = void 0;
  var meridiem = void 0;

  switch (match[0].toLowerCase()) {
    case 'midnight':
      hour = 0;
      meridiem = 0;
      break;
    case 'morning':
    case 'in the morning':
      hour = 9;
      meridiem = 0;
      break;
    case 'noon':
      hour = 12;
      meridiem = 1;
      break;
    case 'afternoon':
    case 'in the afternoon':
      hour = 15;
      meridiem = 1;
      break;
    case 'evening':
    case 'in the evening':
      hour = 19;
      meridiem = 1;
      break;
    case 'night':
    case 'at night':
      hour = 22;
      meridiem = 1;
      break;
    default:
      break;
  }

  return new chrono.ParsedResult({
    ref: ref,
    text: match[0],
    index: match.index,
    start: {
      hour: hour,
      meridiem: meridiem
    }
  });
};

/**
 * When the meridiem is not specified, set the time to after the current time.
 * `at 5 today` (current time is 3pm) => `5pm`.
 */
var forwardHoursRefiner = new chrono.Refiner();
forwardHoursRefiner.refine = function (text, results) {
  var opt = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (opt.forwardHoursOnly !== true) {
    return results;
  }

  // If the date is today and there is no AM/PM (meridiem) specified,
  // let all the time be after the current time.
  results.forEach(function (result) {
    changeDate(result.start, result.ref);
    if (result.end) {
      changeDate(result.end, result.ref);
    }
  });

  return results;

  function changeDate(component, ref) {
    if (!component.isCertain('meridiem') && component.moment(ref).isSame(component, 'day') && component.get('hour') <= ref.getHours()) {
      component.assign('meridiem', 1);
      component.assign('hour', component.get('hour') + 12);
    }
  }
};

var ref = new Date();
var customChrono = new chrono.Chrono(chrono.options.casualOption());
customChrono.parsers.push(dayPeriodsParser);
customChrono.refiners.push(forwardHoursRefiner);

var chrono$1 = {
  setRef: function setRef(newRef) {
    return ref = newRef;
  },
  parse: function parse(phrase) {
    return customChrono.parse(phrase, ref, {
      forwardDatesOnly: true,
      forwardHoursOnly: true
    });
  }
};

var p$1 = Object.freeze({
  normaliseTimes: Symbol('normaliseTimes')
});

/**
 * Current bugs about time extraction from the original text:
 * * The time expressions starting by "on" or "by" are not correctly extracted.
 *   e.g. "The sale on Sunday" => "The sale on" (Incorrect)
 *   e.g. "The sale at 12p.m." => "The sale" (Correct)
 *
 * * When a time frame is set, the "from" should be extracted too.
 *   e.g. "I'm busy from Mon to Tue" => "I'm busy from"
 *
 * * When multiple dates are specified, they should all be removed.
 *   e.g. "I'm busy on Wed and Thurs" =>
 *        ["I'm busy on and Thurs", "I'm busy on Wed and"]
 */

var TimeParser = function () {
  function TimeParser() {
    classCallCheck(this, TimeParser);
  }

  TimeParser.prototype.parse = function parse() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '' };

    var text = this[p$1.normaliseTimes](obj.cleaned);
    var dates = chrono$1.parse(text);

    if (!dates.length) {
      obj.time = null;
      return Promise.resolve(obj);
    }

    var time = dates.map(function (date) {
      var start = date.start ? Number(date.start.date()) : null;
      var end = date.end ? Number(date.end.date()) : null;
      var extractedText = date.text;
      var processedText = text.substr(0, date.index) + text.substr(date.index + extractedText.length);

      return { start: start, end: end, extractedText: extractedText, processedText: processedText };
    });

    obj.time = time;

    return Promise.resolve(obj);
  };

  TimeParser.prototype[p$1.normaliseTimes] = function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    // The Web Speech API returns PM hours as `p.m.`.
    return text.replace(/([0-9]) ?p\.m\./gi, '$1 PM').replace(/([0-9]) ?a\.m\./gi, '$1 AM');
  };

  return TimeParser;
}();

var PATTERNS = {
  en: {
    patterns: [/^Remind (.+?) (?:to|at|on|by|that|about)\b/i, /^Where (?:am|are|is) (.+?) (?:at|on|by)\b/i, /^Where (?:am|are|is) (.+?) supposed to\b/i, /^Where should (.+?) go\b/i, /^What (?:am|are|is) (.+?) doing\b/i, /^What (?:am|are|is) (.+?) supposed to\b/i, /^What should (.+?) do\b/i, /^What (?:do|does) (.+?) do\b/i, /^What is (.+?)(?:'s)? (?:schedule|planning|calendar|agenda)\b/i, /([^ ]+ (?:and|&) [^ ]+)/i],
    // @see http://www.unicode.org/cldr/charts/29/summary/en.html#6402
    listBreaker: /,? (?:and|&) |, /gi
  },

  fr: {
    patterns: [/Rappelle (.+?) de (?:.+)/i, /Rappelle (.+?) d'(?:.+)/i, /Rappelle-(.+?) de (?:.+)/i, /Rappelle-(.+?) d'(?:.+)/i],
    listBreaker: /,? (?:et|&) |, /gi
  },

  ja: {
    patterns: [/(?:.+)を(.+)に思い出させて/i, /(.+)に(?:.+)を思い出させて/i, /(.+)は(?:.+)と言うリマインダーを作成して/i],
    listBreaker: new RegExp('\u3001', 'gu')
  }
};

var p$2 = Object.freeze({
  users: Symbol('users'),
  normalise: Symbol('normalise'),
  parseUsers: Symbol('parseUsers')
});

// @todo Import and use the list of users when multiusers db is ready.

var UsersParser = function () {
  function UsersParser() {
    var users = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    classCallCheck(this, UsersParser);

    this[p$2.users] = users;
  }

  UsersParser.prototype.parse = function parse() {
    var _this = this;

    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '' };

    var text = obj.cleaned;
    var users = null;

    PATTERNS.en.patterns.some(function (pattern) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      users = _this[p$2.parseUsers](match[1]);
      return !!users.length;
    });

    obj.recipients = users;

    return Promise.resolve(obj);
  };

  UsersParser.prototype[p$2.parseUsers] = function () {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return string.split(PATTERNS.en.listBreaker).map(function (user) {
      return user.trim();
    }).filter(function (user) {
      return !!user;
    });
  };

  return UsersParser;
}();

var PATTERNS$1 = {
  en: {
    patterns: [/Remind (?:.+?) (?:to|at|on|by|that|about) (.+)/i, /Remind (?:.+?) that (?:it|there) is (.+)/i],
    // @see http://www.unicode.org/cldr/charts/29/summary/en.html#4
    punctuation: /[-‐–—,;:!?.…'‘’"“”()[\]§@*/&#†‡′″]+$/
  },

  fr: {
    patterns: [/Rappelle (?:.+?) de (.+)/i, /Rappelle (?:.+?) d'(.+)/i, /Rappelle-(?:.+?) de (.+)/i, /Rappelle-(?:.+?) d'(.+)/i],
    punctuation: /[-‐–—,;:!?.…’"“”«»()[\]§@*/&#†‡]+$/
  },

  ja: {
    patterns: [/(.+)を(?:.+)に思い出させて/i, /(?:.+)に(.+)を思い出させて/i, /(?:.+)は(.+)と言うリマインダーを作成して/i],
    punctuation: new RegExp('[-\u203E_\uFF3F\uFF0D\u2010\u2014\u2015\u301C\u30FB\uFF65,\uFF0C\u3001\uFF64;\uFF1B:\uFF1A!\uFF01?\uFF1F.\uFF0E\u2025\u2026\u3002\uFF61\uFF07\u2018\u2019"\uFF02\u201C\u201D(\uFF08)\uFF09\\[\uFF3B\\]\uFF3D{\uFF5B}\uFF5D' + '\u3008\u3009\u300A\u300B\u300C\uFF62\u300D\uFF63\u300E\u300F\u3010\u3011\u3014\u3015\u2016\xA7\xB6@\uFF20*\uFF0A/\uFF0F\uFF3C&\uFF06#\uFF03%\uFF05\u2030\u2020\u2021\u2032\u2033\u3003\u203B]+$', 'u')
  }
};

var p$3 = Object.freeze({
  normalise: Symbol('normalise'),
  parseNoDates: Symbol('parseNoDates'),
  parseMultipleDates: Symbol('parseMultipleDates')
});

var ActionParser = function () {
  function ActionParser() {
    classCallCheck(this, ActionParser);
  }

  ActionParser.prototype.parse = function parse() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { cleaned: '', time: [] };

    var action = null;

    if (obj.time === null) {
      // We use the original phrase.
      var text = this[p$3.normalise](obj.cleaned);
      action = this[p$3.parseNoDates](text);
    } else if (obj.time.length === 1) {
      // We use the original phrase with the time extracted out.
      var _text = this[p$3.normalise](obj.time[0].processedText);
      action = this[p$3.parseNoDates](_text);
    } else if (obj.time.length > 1) {
      var _text2 = this[p$3.normalise](obj.cleaned);
      action = this[p$3.parseMultipleDates](_text2);
    }

    obj.action = action;

    return Promise.resolve(obj);
  };

  ActionParser.prototype[p$3.normalise] = function () {
    var string = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    return string
    // Strip punctuations.
    .replace(PATTERNS$1.en.punctuation, '').trim();
  };

  ActionParser.prototype[p$3.parseNoDates] = function () {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    var action = null;

    PATTERNS$1.en.patterns.some(function (pattern) {
      var match = pattern.exec(text);

      if (!match) {
        return false;
      }

      action = match[1];
      return true;
    });

    return action;
  };

  ActionParser.prototype[p$3.parseMultipleDates] = function () {
    // @todo Implement me.
    console.error('Parsing action with multiple time references is not ' + 'implemented yet.');
    return null;
  };

  return ActionParser;
}();

/* global TwitterCldr, TwitterCldrDataBundle */

/*
 * @todo:
 *   * @see http://www.unicode.org/cldr/charts/29/verify/dates/en.html
 *     for formatting the time of the day.
 */

var p$5 = Object.freeze({
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
  formatHoursAndMinutes: Symbol('formatHoursAndMinutes')
});

var DEFAULT_LOCALE = 'en';
var PATTERNS$2 = {
  en: {
    template: 'OK, I\'ll remind [users] [action] [time].',
    formatUser: function formatUser(user) {
      return user.replace(/\bme\b/gi, 'you').replace(/\bI am\b/gi, 'you are').replace(/\bI have\b/gi, 'you have').replace(/\bI will\b/gi, 'you will').replace(/\bI\b/gi, 'you').replace(/\bmy\b/gi, 'your').replace(/\bmine\b/gi, 'yours');
    }
  },
  fr: {
    template: 'OK, je rappelerai [users] [action] [time].',
    formatUser: function formatUser(user) {
      return user;
    }
  },
  ja: {
    template: '\u627F\u77E5\u3057\u307E\u3057\u305F\u3002[time][users]\u306B[action]\u3092\u30EA\u30DE\u30A4\u30F3\u30C9\u3057\u307E\u3059\u3002',
    formatUser: function formatUser(user) {
      return user;
    }
  }
};

var ReminderConfirmation = function () {
  function ReminderConfirmation() {
    var locale = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_LOCALE;
    classCallCheck(this, ReminderConfirmation);

    this.locale = locale;

    if (typeof TwitterCldr !== 'undefined') {
      TwitterCldr.set_data(TwitterCldrDataBundle);
      this[p$5.listFormatter] = new TwitterCldr.ListFormatter();
    } else {
      this[p$5.listFormatter] = {
        format: function format(a) {
          return a.join(' and ');
        }
      };
    }
  }

  /**
   * Generate a phrase to be spoken to confirm a reminder.
   *
   * @param {Object} reminder
   * @return {string}
   */


  ReminderConfirmation.prototype.confirm = function confirm(reminder) {
    var template = this[p$5.getLocalised]('template');
    var data = {
      users: this[p$5.formatUser](reminder),
      action: this[p$5.formatAction](reminder),
      time: this[p$5.formatTime](reminder)
    };

    return template.replace(/\[([^\]]+)\]/g, function (match, placeholder) {
      return data[placeholder];
    });
  };

  /**
   * Given a property of the PATTERNS object, returns the one matching the
   * current locale or the default one if non existing.
   *
   * @param {string} prop
   * @returns {*}
   */


  ReminderConfirmation.prototype[p$5.getLocalised] = function (prop) {
    var locale = this.locale;
    if (!PATTERNS$2[this.locale] || !PATTERNS$2[this.locale][prop]) {
      locale = DEFAULT_LOCALE;
    }

    return PATTERNS$2[locale][prop];
  };

  ReminderConfirmation.prototype[p$5.formatUser] = function (_ref) {
    var recipients = _ref.recipients;

    var formatUser = this[p$5.getLocalised]('formatUser');
    var formattedUsers = recipients.map(formatUser);
    return this[p$5.listFormatter].format(formattedUsers);
  };

  ReminderConfirmation.prototype[p$5.formatAction] = function (_ref2) {
    var action = _ref2.action;
    var cleaned = _ref2.cleaned;

    var formatUser = this[p$5.getLocalised]('formatUser');
    var formattedAction = formatUser(action);

    var PATTERN1 = new RegExp('\\bthat ' + action, 'iu');
    var PATTERN2 = new RegExp('\\bit is ' + action, 'iu');
    var PATTERN3 = new RegExp('\\bthere is ' + action, 'iu');
    var PATTERN4 = new RegExp('\\babout ' + action, 'iu');

    if (PATTERN1.test(cleaned)) {
      return 'that ' + formattedAction;
    } else if (PATTERN2.test(cleaned)) {
      return 'that it is ' + formattedAction;
    } else if (PATTERN3.test(cleaned)) {
      return 'that there is ' + formattedAction;
    } else if (PATTERN4.test(cleaned)) {
      return 'about ' + formattedAction;
    }

    return 'to ' + formattedAction;
  };

  ReminderConfirmation.prototype[p$5.formatTime] = function (_ref3) {
    var due = _ref3.due;

    if (this[p$5.isToday](due)) {
      var hour = this[p$5.formatHoursAndMinutes](due);
      return 'at ' + hour + ' today';
    } else if (this[p$5.isTomorrow](due)) {
      var _hour = this[p$5.formatHoursAndMinutes](due);
      return 'at ' + _hour + ' tomorrow';
      // @todo Add a pattern here with the weekday if within 7 days.
    } else if (this[p$5.isThisMonth](due)) {
      return moment(due).format('[on the] Do');
    }

    return moment(due).format('[on] MMMM [the] Do');
  };

  ReminderConfirmation.prototype[p$5.isToday] = function (date) {
    var today = moment().startOf('day');
    var tomorrow = moment().add(1, 'day').startOf('day');
    return moment(date).isBetween(today, tomorrow);
  };

  ReminderConfirmation.prototype[p$5.isTomorrow] = function (date) {
    var tomorrow = moment().add(1, 'day').startOf('day');
    var in2days = moment().add(2, 'day').startOf('day');
    return moment(date).isBetween(tomorrow, in2days);
  };

  ReminderConfirmation.prototype[p$5.isThisMonth] = function (date) {
    var thisMonth = moment().startOf('month');
    var nextMonth = moment().add(1, 'month').startOf('month');
    return moment(date).isBetween(thisMonth, nextMonth);
  };

  /**
   * Return a string from a date suitable for speech synthesis.
   *
   * @param {Date} date
   * @return {string}
   */


  ReminderConfirmation.prototype[p$5.formatHoursAndMinutes] = function (date) {
    date = moment(date);
    var format = void 0;

    if (date.minute() === 0) {
      format = date.format('h A'); // 7 PM
    } else if (date.minute() === 15) {
      format = date.format('[quarter past] h A');
    } else if (date.minute() === 30) {
      format = date.format('[half past] h A');
    } else if (date.minute() === 45) {
      var nextHour = date.add(1, 'hour');
      format = nextHour.format('[quarter to] h A');
    } else {
      format = date.format('h:m A'); // 6:24 AM
    }

    // Some speech synthesisers pronounce "AM" as in "ham" (not "A. M.").
    return format.replace(/([0-9]) ?AM$/gi, '$1 A.M.').replace(/([0-9]) ?PM$/gi, '$1 P.M.');
  };

  return ReminderConfirmation;
}();

var p$4 = Object.freeze({
  reminderConfirmation: Symbol('reminderConfirmation')
});

var ReminderRefiner = function () {
  function ReminderRefiner() {
    classCallCheck(this, ReminderRefiner);

    this[p$4.reminderConfirmation] = new ReminderConfirmation();
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


  ReminderRefiner.prototype.refine = function refine() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hasTime = obj.time !== null && obj.time.length === 1 && obj.time[0].start !== null && obj.time[0].end === null;
    var hasUsers = obj.recipients !== null && obj.recipients.length > 0;
    var hasAction = obj.action !== null;

    if (obj.cleaned.toLowerCase().startsWith('remind') && hasTime && hasUsers && hasAction) {
      obj.due = obj.time[0].start;
      obj.confirmation = this[p$4.reminderConfirmation].confirm(obj);
      obj.intent = 'reminder';
    }

    return Promise.resolve(obj);
  };

  return ReminderRefiner;
}();

/* global TwitterCldr, TwitterCldrDataBundle */

var p$6 = Object.freeze({
  // Properties
  time: Symbol('time'),
  users: Symbol('users'),
  listFormatter: Symbol('listFormatter'),

  // Methods
  formatTime: Symbol('formatTime'),
  isToday: Symbol('isToday'),
  isTomorrow: Symbol('isTomorrow'),
  isThisMonth: Symbol('isThisMonth'),
  formatHoursAndMinutes: Symbol('formatHoursAndMinutes')
});

var PATTERNS$4 = {
  en: {
    formatUser: function formatUser(user) {
      return user.replace(/\bme\b/gi, 'you').replace(/\bI am\b/gi, 'you are').replace(/\bI have\b/gi, 'you have').replace(/\bI will\b/gi, 'you will').replace(/\bI\b/gi, 'you').replace(/\bmy\b/gi, 'your').replace(/\bmine\b/gi, 'yours');
    }
  },
  fr: {
    formatUser: function formatUser(user) {
      return user;
    }
  },
  ja: {
    formatUser: function formatUser(user) {
      return user;
    }
  }
};

var QueryConfirmation = function () {
  function QueryConfirmation(_ref) {
    var due = _ref.due;
    var recipients = _ref.recipients;
    classCallCheck(this, QueryConfirmation);

    if (typeof TwitterCldr !== 'undefined') {
      TwitterCldr.set_data(TwitterCldrDataBundle);
      this[p$6.listFormatter] = new TwitterCldr.ListFormatter();
    } else {
      this[p$6.listFormatter] = {
        format: function format(a) {
          return a.join(' and ');
        }
      };
    }

    this[p$6.time] = due;
    this[p$6.users] = recipients;
  }

  QueryConfirmation.prototype.confirm = function confirm(reminder) {
    // We use the users from the original query rather than the found reminder.
    var users = this[p$6.formatUser](this[p$6.users]);

    if (!reminder) {
      var _time = this[p$6.formatTime]({ due: this[p$6.time] });
      return 'I can\'t find anything scheduled for ' + users + ' ' + _time + '.';
    }

    var action = reminder.action;
    var time = this[p$6.formatTime](reminder);

    if (users === 'you' || this[p$6.users].length >= 1) {
      return time + ', ' + users + ' have the following activity: "' + action + '".';
    }

    return time + ', ' + users + ' has the following activity: "' + action + '".';
  };

  QueryConfirmation.prototype[p$6.formatUser] = function (users) {
    var formattedUsers = users.map(PATTERNS$4.en.formatUser);
    return this[p$6.listFormatter].format(formattedUsers);
  };

  QueryConfirmation.prototype[p$6.formatTime] = function (_ref2) {
    var due = _ref2.due;

    var hour = this[p$6.formatHoursAndMinutes](due);

    if (this[p$6.isToday](due)) {
      return 'at ' + hour + ' today';
    } else if (this[p$6.isTomorrow](due)) {
      return 'at ' + hour + ' tomorrow';
      // @todo Add a pattern here with the weekday if within 7 days.
    } else if (this[p$6.isThisMonth](due)) {
      var _day = moment(due).format('Do');
      return 'at ' + hour + ' on the ' + _day;
    }

    var day = moment(due).format('MMMM [the] Do');
    return 'at ' + hour + ' on ' + day;
  };

  QueryConfirmation.prototype[p$6.isToday] = function (date) {
    var today = moment().startOf('day');
    var tomorrow = moment().add(1, 'day').startOf('day');
    return moment(date).isBetween(today, tomorrow);
  };

  QueryConfirmation.prototype[p$6.isTomorrow] = function (date) {
    var tomorrow = moment().add(1, 'day').startOf('day');
    var in2days = moment().add(2, 'day').startOf('day');
    return moment(date).isBetween(tomorrow, in2days);
  };

  QueryConfirmation.prototype[p$6.isThisMonth] = function (date) {
    var thisMonth = moment().startOf('month');
    var nextMonth = moment().add(1, 'month').startOf('month');
    return moment(date).isBetween(thisMonth, nextMonth);
  };

  /**
   * Return a string from a date suitable for speech synthesis.
   *
   * @param {Date} date
   * @return {string}
   */


  QueryConfirmation.prototype[p$6.formatHoursAndMinutes] = function (date) {
    date = moment(date);
    var format = void 0;

    if (date.minute() === 0) {
      format = date.format('h A'); // 7 PM
    } else if (date.minute() === 15) {
      format = date.format('[quarter past] h A');
    } else if (date.minute() === 30) {
      format = date.format('[half past] h A');
    } else if (date.minute() === 45) {
      var nextHour = date.add(1, 'hour');
      format = nextHour.format('[quarter to] h A');
    } else {
      format = date.format('h:m A'); // 6:24 AM
    }

    // Some speech synthesisers pronounce "AM" as in "ham" (not "A. M.").
    return format.replace(/([0-9]) ?AM$/gi, '$1 A.M.').replace(/([0-9]) ?PM$/gi, '$1 P.M.');
  };

  return QueryConfirmation;
}();

var PATTERNS$3 = {
  en: {
    formatUser: function formatUser(user) {
      return user.replace(/\bI\b/gi, 'me').replace(/\bmy\b/gi, 'me').replace(/\bmine\b/gi, 'me');
    }
  },
  fr: {
    formatUser: function formatUser(user) {
      return user;
    }
  },
  ja: {
    formatUser: function formatUser(user) {
      return user;
    }
  }
};

// @todo Handle the case where a time range is specified.

var QueryRefiner = function () {
  function QueryRefiner() {
    classCallCheck(this, QueryRefiner);
  }

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
  QueryRefiner.prototype.refine = function refine() {
    var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var hasTime = obj.time !== null && obj.time.length === 1 && obj.time[0].start !== null && obj.time[0].end === null;
    var hasUsers = obj.recipients !== null && obj.recipients.length > 0;
    var hasNoActions = obj.action === null;

    if (obj.cleaned.match(/^(?:What|Where|When)/i) && hasTime && hasUsers && hasNoActions) {
      var queryConfirmation = new QueryConfirmation({
        due: obj.time[0].start,
        recipients: obj.recipients
      });

      obj.due = obj.time[0].start;
      obj.recipients = obj.recipients.map(PATTERNS$3.en.formatUser);
      obj.confirmation = queryConfirmation.confirm.bind(queryConfirmation);
      obj.intent = 'query';
    }

    return Promise.resolve(obj);
  };

  return QueryRefiner;
}();

var p = Object.freeze({
  // Properties
  cleaners: Symbol('cleaners'),
  parsers: Symbol('parsers'),
  refiners: Symbol('refiners')
});

var IntentParser = function () {
  function IntentParser() {
    classCallCheck(this, IntentParser);

    this[p.cleaners] = [new NormaliseCleaner(), // Always keep this one first.
    new ContractionsCleaner(), new SalutationsCleaner(), new PolitenessCleaner()];
    this[p.parsers] = [new TimeParser(), new UsersParser(), new ActionParser()];
    this[p.refiners] = [new ReminderRefiner(), new QueryRefiner()];

    // Add it to the global scope for debugging.
    var global = new Function('return this')();
    global.intentParser = this;
  }

  IntentParser.prototype.parse = function parse() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

    text = String(text);

    var result = {
      raw: text, // Leave this untouched for debugging purposes.
      intent: null
    };

    var cleaningPromises = this[p.cleaners].map(function (cleaner) {
      return cleaner.clean.bind(cleaner);
    });
    var parsingPromises = this[p.parsers].map(function (parser) {
      return parser.parse.bind(parser);
    });
    var refiningPromises = this[p.refiners].map(function (refiner) {
      return refiner.refine.bind(refiner);
    });

    return new Promise(function (resolve, reject) {
      Promise.resolve(result)
      // Cleaning phase.
      .then(function (result) {
        return cleaningPromises.reduce(function (p, val) {
          return p.then(val);
        }, Promise.resolve(result));
      })

      // Parsing phase.
      .then(function (result) {
        return parsingPromises.reduce(function (p, val) {
          return p.then(val);
        }, Promise.resolve(result));
      })

      // Refining phase.
      .then(function (result) {
        return refiningPromises.reduce(function (p, val) {
          return p.then(val);
        }, Promise.resolve(result));
      })

      // Final result.
      .then(function (result) {
        if (result.intent === null) {
          console.error('The intent could not be parsed:', result);
          return reject(null);
        }

        return resolve(result);
      });
    });
  };

  return IntentParser;
}();

return IntentParser;

})));
//# sourceMappingURL=intent-parser.js.map
