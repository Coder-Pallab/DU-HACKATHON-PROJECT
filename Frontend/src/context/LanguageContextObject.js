import { createContext } from "react";

export const supportedLanguages = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
];

export const LanguageContext = createContext(null);
