import { isStringNumber } from "./utils.ts";

const calculateBmi = (height: number, weight: number) =>
  weight / Math.pow(height / 100, 2);

const evaluateBmi = (bmi: number) => {
  switch (true) {
    case bmi < 16.0:
      return "Underweight (Severe thinness)";
    case bmi >= 16.0 && bmi < 17.0:
      return "Underweight (Moderate thinness)";
    case bmi >= 17.0 && bmi < 18.5:
      return "Underweight (Mild thinness)";
    case bmi >= 18.5 && bmi < 25.0:
      return "Normal range";
    case bmi >= 25.0 && bmi < 30.0:
      return "Overweight (Pre-obese)";
    case bmi >= 30.0 && bmi < 35.0:
      return "Obese (Class I)";
    case bmi >= 35.0 && bmi < 40.0:
      return "Obese (Class II)";
    case bmi >= 40.0:
      return "Obese (Class III)";
    default:
      return "Invalid BMI";
  }
};

const parseArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (isStringNumber(args[2]) && isStringNumber(args[3])) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

const main = (height: number, weight: number) => {
  const bmi = calculateBmi(height, weight);
  return evaluateBmi(bmi);
};

try {
  const { height, weight } = parseArguments(process.argv);
  console.log(main(height, weight));
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}

export default main;
