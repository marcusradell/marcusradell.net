const easeIn = (x: number) => (Math.cos(Math.PI * x + Math.PI) + 1) / 2;

const calculateScaled = (from: number, to: number, scale: number) => {
  const diff = to - from;
  const easedScale = easeIn(scale / 100);
  const result = from + diff * easedScale;

  return result;
};

type Hsl = { h: number; s: number; l: number };

type CreateHslArgs = { from: Hsl; to: Hsl; scale: number };
const createHsl = ({ from, to, scale }: CreateHslArgs) =>
  `hsl(${calculateScaled(from.h, to.h, scale)}, ${calculateScaled(
    from.s,
    to.s,
    scale
  )}%, ${calculateScaled(from.l, to.l, scale)}%)`;

const rotate = (from: number, degrees: number) => (from + degrees) % 360;

const primaryHue = 123;
const secondaryHue = rotate(primaryHue, 90);
const complementHue = rotate(primaryHue, 180);
const secondaryComplementHue = rotate(secondaryHue, 180);

const fromHsl = (h: number) => ({
  h,
  s: 4,
  l: 100
});

const toHsl = (h: number) => ({
  h: h - 22,
  s: 90,
  l: 53
});

const fromToHsl = (h: number) => ({
  from: fromHsl(h),
  to: toHsl(h)
});

const black = (scale: number) =>
  createHsl({
    from: { h: primaryHue, s: 5, l: 100 },
    to: { h: primaryHue, s: 5, l: 0 },
    scale
  });

const primary = (scale: number) =>
  createHsl({
    ...fromToHsl(primaryHue),
    scale
  });

const secondary = (scale: number) =>
  createHsl({
    ...fromToHsl(secondaryHue),
    scale
  });

const complement = (scale: number) =>
  createHsl({
    ...fromToHsl(complementHue),
    scale
  });

const secondaryComplement = (scale: number) =>
  createHsl({
    ...fromToHsl(secondaryComplementHue),
    scale
  });

export const colors = {
  black,
  secondary,
  complement,
  primary,
  secondaryComplement
};

export type Color = keyof typeof colors;
export type Colors = typeof colors;
