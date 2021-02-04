import { assert } from 'chai';
import { ColourPalettes } from './colour-palette';

describe ("ColourPalettes", () => {
  let colourPalettes = new ColourPalettes("#ff0044");

  it("should return a palette of 10 colours when generate is called with a colour", () => {
    const blue = '#1e88e5';
    const palette: string[] = colourPalettes.generate(blue);
    assert.equal(palette.length, 10);
    assert.equal(palette[5], blue)
  })
})
