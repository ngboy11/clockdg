export enum Page {
  Home = 'Home',
  Clock = 'Clock',
  WorldClock = 'WorldClock',
  Alarm = 'Alarm',
  Stopwatch = 'Stopwatch',
  Calendar = 'Calendar',
  Settings = 'Settings',
  About = 'About'
}

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export enum TemperatureUnit {
  Celsius = 'celsius',
  Fahrenheit = 'fahrenheit'
}

export interface WorldClockEntry {
  timezone: string;
  city: string;
}

export interface Alarm {
  id: number;
  time: string;
  label: string;
  sound: string;
  customSound?: string;
  enabled: boolean;
}

export interface Reminder {
  id: number;
  text: string;
}