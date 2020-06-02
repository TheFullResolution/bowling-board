import range from "lodash.range";

interface Weights {
  [key: number]: number;
}

const weights: Weights = {
  0: 100,
  1: 30,
  2: 50,
  3: 50,
  4: 80,
  5: 110,
  6: 130,
  7: 130,
  8: 130,
  9: 90,
  10: 100,
};

const MAX_OPTION_NUMBER = 11;

const getTableForWeightedRand = (currentWeights: Weights) => {
  const table: number[] = [];
  for (let i in currentWeights) {
    table.push(Number(i));
  }
  return table;
};

export const weightedRand = (options: number) => {
  let table: number[] = [];

  if (options === 0) {
    return 0;
  }

  if (options === MAX_OPTION_NUMBER) {
    table = getTableForWeightedRand(weights);
  } else {
    const remainingOptions = range(options);
    const remainingWeight = remainingOptions.reduce((previous, current) => {
      return previous - weights[current];
    }, 1000);

    const remainingWeights = remainingOptions.reduce((previous, current) => {
      if (current === 0) {
        previous[current] = weights[current] + remainingWeight;
      } else {
        previous[current] = weights[current];
      }
      return previous;
    }, {} as Weights);

    table = getTableForWeightedRand(remainingWeights);
  }
  return table[Math.floor(Math.random() * table.length)];
};
