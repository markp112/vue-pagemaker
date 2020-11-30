import { MousePosition } from '@/components/page-builder-elements/generic/mixins/generic-components-mixin';
import { Location } from '@/models/components/components';

export class Pan {

   pan(deltaMouse: MousePosition, location: Location): Location {
   console.log('%c⧭', 'color: #f279ca', location);
   console.log('%c⧭', 'color: #99adcc', deltaMouse);
   
    const newLocation: Location ={
      left: location.left + deltaMouse.x,
      top: location.top + deltaMouse.y,
    }
    return newLocation;
  }

}