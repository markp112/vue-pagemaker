
import Snackbar from '../src/components/base/notifications/snackbar/snackbar.vue'
import { storiesOf } from '@storybook/vue';

storiesOf('Snackbar', module)
.add('default',() => ({
  components: { Snackbar },
  template: <Snackbar/>
}))