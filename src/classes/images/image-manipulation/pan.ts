import { ALocation } from '@/classes/a-location/aLocation';
import { MousePosition } from "@/components/page-builder-elements/generic/mixins/generic-components-mixin";

export class Pan {
  pan(deltaMouse: MousePosition, location: ALocation): ALocation {
    const newLocation = new ALocation(
      location.top + deltaMouse.y,
      location.left + deltaMouse.x,
      location.units
    );
    return newLocation;
  }
}
