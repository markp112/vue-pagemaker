import store from '@/store';
import { Module, Mutation, Action, VuexModule, getModule } from 'vuex-module-decorators';
import { ComponentDefinitionInterface } from '@/models/components/base-component';
// manages properties for components used by PageMaker as part of the pagemaker functionality

export interface ComponentPropsStateInterface {
  _showIconPicker: boolean;
}
@Module({ name: 'component-props', dynamic: true, store })
export class ComponentPropsStore extends VuexModule implements ComponentPropsStateInterface {
  _showIconPicker = false;

  @Mutation 
  private setIconPicker(state: boolean) {
    this._showIconPicker = state;
  }

  @Action
  public toggleIconPicker(value: boolean) {
    this.context.commit('setIconPicker', value);
  }

  public get showIconPicker(): boolean {
    return this._showIconPicker;
  }
}

export const ComponentPropsModule = getModule(ComponentPropsStore);