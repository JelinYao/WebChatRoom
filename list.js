/*****************************************
* 按照C语言的写法写了个单链表结构类
* 2020年3月13日16:45:06
* https://github.com/JelinYao
*/


class listNode{
  constructor(value){
    this.value = value;
    this.next = null;
  }
}

class list{
  constructor(){
    this.head = null;
    this.length = 0;
  }

  add(value){
    var item = new listNode(value);
    this.length++;
    if(this.head == null){
      this.head = item;
      return;
    }
    var temp = this.head;
    while(temp.next != null){
      temp = temp.next;
    }
    temp.next = item;
  }

  remove(value){
    if(this.head == null){
      throw "list is empty";
    }
    if(this.head.value === value){
      this.head = null;
      this.head.length = 0;
      return;
    }
    var temp = this.head;
    while(temp.next != null){
      if(temp.next.value === value){
        //找到了
        temp.next = temp.next.next;
        this.head.length--;
        break;
      }
      temp = temp.next;
    }
  }

  find(value){
    if(this.head == null){
      throw "list is empty";
    }
    var temp = this.head;
    while(temp != null){
      if(temp.value === value){
        //找到了
        return temp;
      }
      temp = temp.next;
    }
    return null;
  }

  size(){
    return this.length;
  }

  isEmpty(){
    return this.length === 0;
  }
}

module.exports = {
  list : list
}


  