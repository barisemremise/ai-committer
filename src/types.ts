export type Convention = {
  prefix: string;
  description: string;
}

export type Config = {
  maxMessageLength: number;
  language: string;
  conventions: Convention[];
}
