interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (dailyHours: number[], target: number): ExerciseResult => {
    const periodLength = dailyHours.length;
    const trainingDays = dailyHours.filter(h => h > 0).length;
    const average = dailyHours.reduce((a, b) => a + b, 0) / periodLength;
    const success = average >= target;

    let rating: number;
    let ratingDescription: string;

    if (average >= target) {
    rating = 3;
    ratingDescription = 'Great job, target achieved!';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'You need to push harder';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
}

if (require.main === module) {
  const args = process.argv.slice(2).map(Number);
  if (args.length < 2) {
    throw new Error('Please provide at least two arguments: target and daily hours');
  }

  const [target, ...dailyHours] = args;
  if (isNaN(target) || dailyHours.some(isNaN)) {
    throw new Error('All arguments must be numbers');
  }

  console.log(calculateExercises(dailyHours, target));
}

export default calculateExercises;