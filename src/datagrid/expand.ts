//
// @description :
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT
import {autoinject} from 'aurelia-framework';
import {UILocalDS} from "../resources/data/ui-data-source";
import {UIUtils} from "../resources/utils/ui-utils";
import * as _ from 'lodash';
import * as moment from 'moment';

@autoinject()
export class CompDatagrid {
  constructor(public element: Element) { }

  // aurelia hooks
  // canActivate(model) { return true; }
  // activate(model) { return true; }
  // bind(bindingContext) { }
  attached() {
    setTimeout(() => {

      let subdata1 = [];
      for (let i = 0; i < 10; i++)
        subdata1.push({
          id: i + 1,
          icon: Math.floor(Math.random() * 5),
          text: this.getString(),
          date: moment().add(Math.random() * -7200, 'day'),
          time: moment().add(Math.random() * -(60 * 20), 'minute'),
          number: Math.random() * 10800,
          currency: Math.random() * 10800
        });

      let subdata = [];
      for (let i = 0; i < 10; i++)
        subdata.push({
          id: i + 1,
          icon: Math.floor(Math.random() * 5),
          text: this.getString(),
          date: moment().add(Math.random() * -7200, 'day'),
          time: moment().add(Math.random() * -(60 * 20), 'minute'),
          number: Math.random() * 10800,
          currency: Math.random() * 10800,
          subdata: subdata1
        });

      for (let i = 0; i < 20; i++)
        this.data.push({
          id: i + 1,
          icon: Math.floor(Math.random() * 5),
          text: this.getString(),
          date: moment().add(Math.random() * -7200, 'day'),
          time: moment().add(Math.random() * -(60 * 20), 'minute'),
          number: Math.random() * 10800,
          currency: Math.random() * 10800,
          subdata: subdata
        });
      this.store1 = new UILocalDS(_.cloneDeep(this.data));
      this.store2 = new UILocalDS(_.cloneDeep(this.data));

      this.store1.fetchData();
      this.store2.fetchData();
    }, 500);
  }
  // detached() { }
  // unbind() { }
  // deactivate() { }
  // end aurelia hooks

  icons = ['icon-moon-appleinc', 'icon-moon-android', 'icon-moon-amazon', 'icon-moon-windows8', 'icon-moon-mobile'];
  titles = ['Apple', 'Android', 'Amazon', 'Windows', 'Unknown']

  selected(rec) {
    UIUtils.toast({ title: 'Row Click', message: `${rec.id} - ${rec.text}`, theme: 'info' });
  }
  getString() {
    let ret = '', ar = 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(',');
    for (let i = 0; i < (Math.random() * 8) + 3; i++) ret += ar[Math.floor(Math.random() * 26)];
    ret += ' ';
    for (let i = 0; i < (Math.random() * 8) + 3; i++) ret += ar[Math.floor(Math.random() * 26)];
    return ret;
  }

  getSubview(record) {
    return `<div class="ui-pad-all">
      <h5><ui-glyph class="dg-glyph ${this.icons[record.icon]}" glyph="${this.icons[record.icon]}"></ui-glyph>&nbsp;Data view</h5><hr/>
      <p>Record of \${record.text}
    </div>`
  }

  store1;
  store2;
  store3;
  data = []

  clicked(msg, rec) {
    UIUtils.toast({ title: msg, message: `${rec.id} - ${rec.text}`, theme: 'info' });
    return true;
  }
}
