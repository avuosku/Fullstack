const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / ((height / 100) ** 2);

  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal range";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

export default calculateBmi;

// Käyttö komentoriviltä:
if (require.main === module) {
  const [,, height, weight] = process.argv;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    console.log('Usage: npm run calculateBmi <height> <weight>');
  } else {
    console.log(calculateBmi(Number(height), Number(weight)));
  }
}
