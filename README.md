# **FML**: **F**ields, **M**odels, **L**ists

A moderately opinionated library for building model-driven forms for web UIs.

## WTF?

This library is intended to make building forms for web UIs stupid easy and 100% declarative. It is designed to be extensible to add additional control bindings, configurations, and validators.

It's "experimental" right now, but is stable enough to use. Feedback very welcome! Open issues and offer feedback!

Track progress towards a 1.0 release [here](https://github.com/evanbb/fml/projects).

## Overview

FML provides a set of TypeScript declarations along with a small, extensible core to provide a means to bind declarations to the UI. Bindings can be provided to Web Components, React, Vue, Svelte, Angular, etc.

Conceptually, there are these three distinct types of form elements, each with their own purpose:

### Fields

Fields are individual form controls and represent a model's primitive properties. These can represent the following types:

* `number`
* `string`
* `boolean`
* `Date`

Most often, they will be rendered as an `<input />` of some `type`, but this is not a strict rule: For example, a property like `description: string` could be rendered to a more complex form control like a WYSIWYG editor. As long as the control holds a `string` value, it is a legitimate option to bind to a `string` property in your model.

### Models

Models are objects: an aggregation of properties represented by [Fields](#fields), nested [Models](#models), and [Lists](#lists).

### Lists

Lists are a collection of [Fields](#fields), [Models](#models), or even nested [Lists](#lists) (e.g., a `List` of `Workflow`s, where a `Workflow` is a `List` of `WorkflowStep`s).

### Example

In the example below, the model `Contact` has one primitive properties (which would be rendered as a [Field](#fields)), another that is a nested [Model](#models), and one that is an array of `string` (which would be rendered as a [List](#lists)):

```ts
interface Contact {
  website: string; // <-- Field
  fullName: { // <-- Model
    first: string // <-- Field
    middle: string // <-- Field
    last: string // <-- Field
  };
  emailAddresses: string[]; // <-- List
}
```
## Contributing

DO IT! 🚀

Start by looking for and/or opening [issues](https://github.com/evanbb/fml/issues) for tracking. I don't have much for contribution guidelines right now, but please follow a few best practices:
* TypeScript
  * Prefer `interface` over `type` aliases wherever possible. This is what allows extension of core types.
  * Prefer `const` over `let`, and don't use `var` in code. When compiling, `var` will be emitted to avoid TDZ management performance hit, but code should adhere to stricter variable declaration.
* React
  * Function components with hooks only, please
  * Prefer a single, default `export` for components in a `PascalCasedFile.tsx`, named `export`s for everything else in a `camelCasedFile.ts`
  * Write stories and tests for what you build/fix/whatever