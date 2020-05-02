export class ComponentCounter {
  
  private static instance: ComponentCounter;
  private counter = 0;
  
  
  public static getInstance(): ComponentCounter {
    if (!ComponentCounter.instance) {
      ComponentCounter.instance = new ComponentCounter();
    }
    return ComponentCounter.instance;
  }

  public getCounter(): number {
    return this.counter;
  }

  public getNextCounter (): number  {
    console.log('Counter called', this.counter)
    const currentCounter = this.counter;
    this.counter++;
    return currentCounter;
  }
}