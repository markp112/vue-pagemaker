import '@/classes/a-location/aLocation'
import { ALocation } from '@/classes/a-location/aLocation'

describe("ALocation", () => {

  let aLocation: ALocation;

  it("should construct a new location with a top and left value set", () => {
    aLocation = new ALocation(10,20);
    expect(aLocation.top).toEqual(10);
    expect(aLocation.left).toEqual(20);
    aLocation.top = 30;
    expect(aLocation.top).toEqual(30);
    aLocation.left = 5;
    expect(aLocation.left).toEqual(5);
    aLocation.units = 'em';
    expect(aLocation.units).toEqual('em');
  });

  it("should when toStyle is called return a css style tag containing top and left values", () => {
    aLocation = new ALocation(10,20, 'em');
    const style = aLocation.toStyle();
    expect(style).toContain('left:20em;');
    expect(style).toContain('top:10em;');
  })

  it("Should return an object matching Location when toStringObject is called", () => {
    aLocation = new ALocation(10,20, 'em');
    const location = aLocation.toStringObject();
    expect(location.left).toEqual(20);
    expect(location.top).toEqual(10);
    expect(location.units).toEqual('em');
  })

})