import { Config, adjectives, colors, uniqueNamesGenerator } from 'unique-names-generator';


export const getRandomNumber = (min: number, max: number) => {
  return Math.floor((Math.random() * max) + min);
};

const customConfig: Config = {
  dictionaries: [adjectives, colors],
  separator: '-',
  length: 2,
};

export const generateRandomSiteName = () => {
  return uniqueNamesGenerator(customConfig);
} 
