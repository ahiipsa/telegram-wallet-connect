import {action, makeObservable, observable} from 'mobx'

export class SendFormStore {

  public address = '';
  public amount = '';

  constructor() {
    makeObservable(
      this,
      {
        address: observable,
        amount: observable,
      },
      { autoBind: true }
    )
  }
}

export const sendFormStore = new SendFormStore();