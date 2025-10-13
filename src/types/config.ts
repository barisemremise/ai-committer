import { Convention } from "./convention";

export type Config = {
  maxMessageLength: number;
  language: string;
  conventions: Convention[];
}
