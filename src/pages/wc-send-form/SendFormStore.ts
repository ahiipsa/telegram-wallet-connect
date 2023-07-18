import {action, makeObservable, observable} from 'mobx'
import {isAddress, parseEther} from "viem";

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

  isValid() {
    const amount = parseFloat(this.amount);
    return !isNaN(amount) && amount > 0 && isAddress(this.address);
  }

  getEthAmount() {
    const a = parseFloat(this.amount);

    if (isNaN(a) || a < 0) {
      return parseEther('0');
    }

    return parseEther(this.amount);
  }
}

export const sendFormStore = new SendFormStore();