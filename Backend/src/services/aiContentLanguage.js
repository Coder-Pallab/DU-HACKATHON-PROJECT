import { LANGUAGES } from '../constants/languages.js';

export const getContentLanguage = (student) =>
  student.preferredLanguage === LANGUAGES.ASSAMESE
    ? LANGUAGES.ASSAMESE
    : LANGUAGES.ENGLISH;

export const getContentLanguageInstruction = (language) =>
  language === LANGUAGES.ASSAMESE
    ? 'Generate all explanatory content in natural, fluent Assamese (অসমীয়া). Maintain technical terms, programming language names, framework names and official resource titles in English where appropriate. Do not generate explanatory paragraphs in English.'
    : 'Generate all content in clear, professional English.';

export const containsAssameseText = (value) =>
  typeof value === 'string' && /[\u0980-\u09FF]/u.test(value);
