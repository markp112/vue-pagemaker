import {Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators'

@Module({name: 'component-props' })
export default class ComponentPropsModule extends VuexModule {
  _showIconPicker = false;

  @Mutation setIconPicker(state: boolean) {
    this._showIconPicker = state;
  }

  @Action
  toggleIconPicker(value: boolean) {
    this.context.commit('setIconPicker', value)
  }

  get showIconPicker(): boolean {
    return this._showIconPicker
  }
}