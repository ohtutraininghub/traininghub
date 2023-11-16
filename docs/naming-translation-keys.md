# Naming i18n Translation Keys

This project utilizes the [i18next framework](https://www.i18next.com/). The following guide provides instructions to maintain consistency and unambiguity when naming translation keys.

## General Goal

As a general goal, each translation key should be named in a manner that enables an external translator to provide a translation for the string. This involves using descriptive names that offer relevant context.

Translation keys are located in JSON files within the `src/app/[lang]/locales/` directory. Each locale has a separate folder (e.g., `locales/en/`). Note that currently the project supports only the `en` locale.

To ensure naming convention consistency, the project adheres to the following principles: nesting, common keys, and unambiguity. Additionally, alphabetical order should always be maintained within the JSON files.

## Nesting

Encouraging the use of nested levels enhances contextual understanding. In nesting, the key is divided into organizational units to clarify the context. Consider a component named `CourseAlarm` containing a button with a tooltip. The following pattern can be used: `CourseAlarm.button.tooltip`. In this case, the JSON file in the components folder would include the following:

```
CourseAlarm: {
  button: {
    tooltip: "Close alarm"
  }
}
```

This provides context to the translator: inside the CourseAlarm component, there is a button with a tooltip. To include the button text, we would have the following inside the JSON file:

```
CourseAlarm: {
  button: {
    text: "Close",
    tooltip: "Close alarm"
  }
}
```

Various suggested organizational units include:

    alt
    errors
    field
    form
    label
    message
    text

While nesting is encouraged, excessive nesting, particularly beyond five levels, should be avoided unless there is a specific reason.

Please note the following:

- For component names, use **PascalCase** (e.g., "CourseAlarm").
- Other parts of the key use **snakeCase** (e.g., "viewProfile", "label").

## Common Keys

Certain strings appear across the entire application. To reduce duplicates and ease maintenance, use a separate common file to handle these. If a string appears across several pages/components and can be considered generic, include it from a common namespace.

```
{
  "button.cancel": "Cancel",
  "button.ok": "OK",
  "error.generic": "An unexpected error occurred."
}
```

## Unambiguous Key Naming

Finally, key names should be unambiguous.

### Best Practices to Avoid Ambiguity:

a) Descriptive and Clear Keys

Use descriptive and clear key names that provide a distinct indication of their purpose. For example:

```
"registration.form.field.username.label": "Username",
"registration.form.field.password.label": "Password",
"registration.form.submit.button": "Submit Registration"
```

These keys offer a comprehensive understanding of their roles within the registration form context.

b) Specificity for Clarity

Be specific in your key names to avoid ambiguity.

**Good:**

```
"error.network": "Unable to connect to the server. Please try again later."
```

**Avoid:**

```
"error": "An error occurred."
```

### Practices to Avoid:

a) Vague and General Names

Steer clear of vague and overly general key names.

**Avoid:**

```
"text": "Content goes here."
```

b) Unnecessary Abbreviations

Avoid unnecessary abbreviations that may hinder clarity.

**Avoid:**

```
"btnLbl": "Click me"
```

c) Inconsistent naming

Maintain consistency in key naming to prevent confusion.

**Avoid:**

```
"error_message": "An error occurred.",
"error-msg": "An unexpected error happened.",
"errormessage": "Error encountered."
```
