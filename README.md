# :interrobang::bangbang: Intent parser [![Build Status](https://travis-ci.org/fxbox/intent-parser.svg?branch=master)](https://travis-ci.org/fxbox/intent-parser)

> An intent parser designed for Project Abigail.

## Philosophy

This intent parser uses pattern matching. The parsing operates in 3 
different stages:

* Cleaning
* Parsing
* Refining

All of these stages are promises based to make it possible to handle 
asynchronous code, although at the moment all the code is synchronous.

### Cleaning

In order to ease the writing of new patterns, a cleaning step takes place. It 
aims at reducing the complexity of sentences while preserving their meanings.

Consider the following phrases:
```
Hey, can you please let me know when am I free?
Can you please let me know when I'm free?
Please let me know when I'm free.
```

They all can be simplified to:
```
Let me know when I am free.
```

It becomes easier to write new patterns without worrying about supporting 
things like contractions (`I'm` and `I am`). Only the full forms (`I am`) are 
retained and should be used in patterns.

### Parsing

The parsing and refining philosophy was inspired by [Chrono](https://github.com/wanasit/chrono).

The parsing attempts to identify semantical components of the phrase. Several 
passes are applied successively. Each of these passes have a single focus and 
try to extract things like temporal notions, people or actions.

During that phase the logic is kept to a minimum.

### Refining

The refining phase attempts to make sense out of the elements extracted during 
the parsing.

If a person, a time and an action were extracted from a sentence, it is probably
a request for creating a new reminder.

On the other hand, if only a person and a time were extracted and the input 
looks like a question then it is likely a query about someone's activity.

## Build

```bash
$ npm run build
```

## Unit tests

```bash
$ npm test
```
