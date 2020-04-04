import {Module, VuexModule, MutationAction, Mutation, Action} from 'vuex-module-decorators'
// manages properties for components used by PageMaker as part of the pagemaker functionality
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