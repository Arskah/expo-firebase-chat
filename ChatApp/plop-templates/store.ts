import { observable, action } from "mobx";
import { observer } from "mobx-react";

class {{ properCase name }} {
  @observable counter = 0;

  @action.bound
  increment() {
    this.counter += 1;
  }
}

export default new {{ properCase name }}();
