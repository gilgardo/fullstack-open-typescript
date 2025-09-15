import { isStringNumberArr, makeNumberArr } from "./utils.ts";

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: 1 | 2 | 3;
  ratingDescription: string;
  target: number;
  average: number;
}

const getRatingAndDesc = (avg: number, target: number) => {
  let rating: 1 | 2 | 3;
  let ratingDescription: string;

  if (avg >= target) {
    rating = 3;
    ratingDescription = "great job, you met your target!";
  } else if (avg >= target * 0.8) {
    rating = 2;
    ratingDescription = "not too bad but could be better";
  } else {
    rating = 1;
    ratingDescription = "you need to work harder";
  }

  return { rating, ratingDescription };
};
const evaluateData = (data: number[], target: number): Result => {
  const average = data.reduce((tot, cur) => tot + cur, 0) / data.length;
  const { rating, ratingDescription } = getRatingAndDesc(average, target);
  return {
    periodLength: data.length,
    trainingDays: data.filter((hour) => hour > 0).length,
    success: average >= target,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const parseArguments = (args: string[]): { data: number[]; target: number } => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const usersArgs = args.slice(2);

  if (isStringNumberArr(usersArgs)) {
    const numberArr = makeNumberArr(usersArgs);
    const data = numberArr.slice(0, -1);
    const target = numberArr[numberArr.length - 1];
    return {
      data,
      target,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

try {
  const { data, target } = parseArguments(process.argv);
  console.log(evaluateData(data, target));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export default evaluateData;
