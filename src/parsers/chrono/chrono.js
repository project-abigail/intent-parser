import chrono from 'chrono-node';

/**
 * Parse day periods according to CLDR.
 * @see http://www.unicode.org/cldr/charts/29/verify/dates/en.html
 */
const dayPeriodsParser = new chrono.Parser();
dayPeriodsParser.pattern =
  () => new RegExp('midnight|morning|in the morning|noon|' +
    'afternoon|in the afternoon|evening|in the evening|night|at night', 'i');
dayPeriodsParser.extract = (text, ref, match) => {
  let hour;
  let meridiem;

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
      hour = 18;
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
    ref,
    text: match[0],
    index: match.index,
    start: {
      hour,
      meridiem,
    },
  });
};

/**
 * When the meridiem is not specified, set the time to after the current time.
 * `at 5 today` (current time is 3pm) => `5pm`.
 */
const forwardHoursRefiner = new chrono.Refiner();
forwardHoursRefiner.refine = (text, results, opt = {}) => {
  if (opt.forwardHoursOnly !== true) {
    return results;
  }

  // If the date is today and there is no AM/PM (meridiem) specified,
  // let all the time be after the current time.
  results.forEach((result) => {
    changeDate(result.start, result.ref);
    if (result.end) {
      changeDate(result.end, result.ref);
    }
  });

  return results;

  function changeDate(component, ref) {
    if (!component.isCertain('meridiem')
      && component.moment(ref).isSame(component, 'day')
      && component.get('hour') <= ref.getHours()) {
      component.assign('meridiem', 1);
      component.assign('hour', component.get('hour') + 12);
    }
  }
};

const customChrono = new chrono.Chrono(chrono.options.casualOption());
customChrono.parsers.push(dayPeriodsParser);
customChrono.refiners.push(forwardHoursRefiner);

export default {
  parse: (phrase) => customChrono.parse(phrase, null, {
    forwardDate: true,
    forwardDatesOnly: true,
    forwardHoursOnly: true,
  }),
};
