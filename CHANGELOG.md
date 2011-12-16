# Changelog

## 1.0.7

* Fix `...` (aka `Overload.More`) bug when it matches 0 arguments and thus should be recognized as empty `Array`.
* Fix bug when comparing `...` (aka `Overload.More`) with numbers of `*` (aka `Overload.Any`).

## 1.0.6

* Added support for exporting as YUI module.

## 1.0.5

* Replaced all `.yield` in Async and List with `["yield"]` in order to avoid the use of reserved word.
* Minor code tweak.

## 1.0.4

* Fixed the misuse of module causing all scripts stop working for browsers.

## 1.0.3

* Added `Async.collect` for parallel operations.

## 1.0.2

* Redesign `...` (aka `Overload.More`) usage to make it work like CoffeeScript's.

## 1.0.1

* Added `Async.instant` as a short-cut to `Async.wait(0, content)`.

## 1.0

* First stable release.
