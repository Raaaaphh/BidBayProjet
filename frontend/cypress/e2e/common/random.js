export function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const words = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
];

export function randomWord() {
  const index = Math.floor(Math.random() * words.length);
  return words[index];
}

export function randomSentence(k) {
  let sentence = randomWord().charAt(0).toUpperCase() + randomWord().slice(1);
  for (let i = 1; i < k; i++) {
    sentence += " " + randomWord();
  }
  return sentence;
}

export function randomDate() {
  const now = new Date();
  const randomOffset = Math.floor(Math.random() * 20) - 10; // random number between -10 and 10
  const randomDate = new Date(
    now.getTime() + randomOffset * 24 * 60 * 60 * 1000
  ); // add random number of days to current date
  return randomDate;
}

export function randomPastDate() {
  const now = new Date();
  const randomOffset = -Math.ceil(Math.random() * 10); // random number between -10 and 10
  const randomDate = new Date(
    now.getTime() + randomOffset * 24 * 60 * 60 * 1000
  ); // add random number of days to current date
  return randomDate;
}

export function randomFuturDate() {
  const now = new Date();
  const randomOffset = Math.ceil(Math.random() * 10); // random number between -10 and 10
  const randomDate = new Date(
    now.getTime() + randomOffset * 24 * 60 * 60 * 1000
  ); // add random number of days to current date
  return randomDate;
}

export function randomBoolean() {
  return Math.random() > 0.5;
}

export function randomImageUrl() {
  return `https://picsum.photos/id/${randomIntFromInterval(1, 100)}/512/512`;
}
