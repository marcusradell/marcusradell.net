type CreateHslArgs = { h: number; s: number; l: number };
const createHsl = ({ h, s = 70, l = 70 }: CreateHslArgs) =>
  `hsl(${h}, ${easeIn(s / 100) * 100}%, ${easeIn(l / 100) * 100}%)`;

const rotate = (from: number, degrees: number) => (from + degrees) % 360;

const primaryHue = 123;
const secondaryHue = rotate(primaryHue, 90);
const complementHue = rotate(primaryHue, 180);
const secondaryComplementHue = rotate(secondaryHue, 180);

const black = (l: number) => createHsl({ h: primaryHue, s: 5, l });

const primary = (l: number) => createHsl({ h: primaryHue, s: 50, l });
const secondary = (l: number) => createHsl({ h: secondaryHue, s: 50, l });
const complement = (l: number) => createHsl({ h: complementHue, s: 50, l });
const secondaryComplement = (l: number) =>
  createHsl({ h: secondaryComplementHue, s: 50, l });

const easeIn = (x: number) => (Math.cos(Math.PI * x + Math.PI) + 1) / 2;

export const colors = {
  black,
  secondary: secondary,
  complement: complement,
  primary: primary,
  secondaryComplement: secondaryComplement
};

export type Color = keyof typeof colors;
export type Colors = typeof colors;
