const numeric: string = "0123456789";
const lower: string = "abcdefghijklmnopqrstuvwxyz";
const upper: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const special: string = "!@#$%&*/";

interface generationParams {
  length: number;
  containsNumeric: boolean;
  containsLowerCase: boolean;
  containsUpperCase: boolean;
  containsSpecialChar: boolean;
}

type operationTypes = "numeric" | "lower" | "upper" | "special";

interface pickerParams {
  operation: operationTypes;
}

function getRandomChar(charSet: string): string {
  const randomIndex = Math.floor(Math.random() * charSet.length);
  return charSet.charAt(randomIndex);
}

function swapPositions(pass: string): string {
  let splittedPass = pass.split("");
  const n = splittedPass.length;

  for (let i = n - 1; i > 0; --i) {
    const positionToSwap = Math.floor(Math.random() * (i + 1));

    [splittedPass[i], splittedPass[positionToSwap]] = [
      splittedPass[positionToSwap],
      splittedPass[i],
    ];
  }

  return splittedPass.join("");
}

export function generatePassword(params: generationParams): string {
  let charset = "";
  let generatedPass = "";

  if (params.containsNumeric) {
    charset += numeric;
    generatedPass += getRandomChar(numeric);
  }
  if (params.containsLowerCase) {
    charset += lower;
    generatedPass += getRandomChar(lower);
  }
  if (params.containsUpperCase) {
    charset += upper;
    generatedPass += getRandomChar(upper);
  }
  if (params.containsSpecialChar) {
    charset += special;
    generatedPass += getRandomChar(special);
  }

  const passLengthBeforeLoop = generatedPass.length;

  for (
    let i = 0, n = charset.length;
    i < params.length - passLengthBeforeLoop;
    ++i
  ) {
    generatedPass += charset.charAt(Math.floor(Math.random() * n));
  }

  return swapPositions(generatedPass);
}
