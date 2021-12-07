export class I18nText<T extends I18nTextDefault> {
  text: T;

  constructor(text: T) {
    this.text = text;
  }

  get(key: keyof T, locale: string = "en") {
    return this.text[key][locale as "en" | "id"];
  }
}
