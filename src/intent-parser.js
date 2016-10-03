import NormaliseCleaner from './cleaners/normalise-cleaner';
import ContractionsCleaner from './cleaners/contractions-cleaner';
import SalutationsCleaner from './cleaners/salutations-cleaner';
import PolitenessCleaner from './cleaners/politeness-cleaner';

import TimeParser from './parsers/time-parser';
import UsersParser from './parsers/users-parser';
import ActionParser from './parsers/action-parser';

import ReminderRefiner from './refiners/reminder-refiner';
import QueryRefiner from './refiners/query-refiner';

const p = Object.freeze({
  // Properties
  cleaners: Symbol('cleaners'),
  parsers: Symbol('parsers'),
  refiners: Symbol('refiners'),
});

export default class IntentParser {
  constructor() {
    this[p.cleaners] = [
      new NormaliseCleaner(), // Always keep this one first.
      new ContractionsCleaner(),
      new SalutationsCleaner(),
      new PolitenessCleaner(),
    ];
    this[p.parsers] = [
      new TimeParser(),
      new UsersParser(),
      new ActionParser(),
    ];
    this[p.refiners] = [
      new ReminderRefiner(),
      new QueryRefiner(),
    ];

    // Add it to the global scope for debugging.
    const global = new Function('return this')();
    global.intentParser = this;
  }

  parse(text = '') {
    text = String(text);

    const result = {
      raw: text, // Leave this untouched for debugging purposes.
      intent: null,
    };

    const cleaningPromises = this[p.cleaners]
      .map((cleaner) => cleaner.clean.bind(cleaner));
    const parsingPromises = this[p.parsers]
      .map((parser) => parser.parse.bind(parser));
    const refiningPromises = this[p.refiners]
      .map((refiner) => refiner.refine.bind(refiner));

    return new Promise((resolve, reject) => {
      Promise.resolve(result)
      // Cleaning phase.
        .then((result) => cleaningPromises
          .reduce((p, val) => p.then(val), Promise.resolve(result)))

        // Parsing phase.
        .then((result) => parsingPromises
          .reduce((p, val) => p.then(val), Promise.resolve(result)))

        // Refining phase.
        .then((result) => refiningPromises
          .reduce((p, val) => p.then(val), Promise.resolve(result))
        )

        // Final result.
        .then((result) => {
          if (result.intent === null) {
            console.error('The intent could not be parsed:', result);
            return reject(null);
          }

          return resolve(result);
        });
    });
  }
}
