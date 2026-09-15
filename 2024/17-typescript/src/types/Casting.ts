const tekst: string = "2";

export const sum = (a: number, b: number): number => {
  return a + b;
};

sum(1, 3);
// sum(tekst as number, 3);
sum(Number(tekst), 3);
sum(parseInt(tekst), 3);