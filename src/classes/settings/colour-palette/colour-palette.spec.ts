import { ColourPalettes } from './colour-palette';

describe ("ColourPalettes", () => {
  let colourPalettes = new ColourPalettes("#ff0044");

  it("should return a palette of 10 colours when generate is called with a colour", () => {
    const blue = '#1e88e5';
    const palette: string[] = colourPalettes.generate(blue);
    expect(palette.length).toEqual(10);
    expect(palette[5]).toEqual(blue)
  })
})