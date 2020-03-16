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
  constructor(_compare){
    this.head = null;
    this.length = 0;
    if(_compare === null || _compare === undefined){
      this.compare = this.defaultCmp;
    }
    else{
      this.compare = _compare;
    }
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
    if(this.compare(this.head.value, value)){
      this.head = null;
      this.length = 0;
      return;
    }
    var temp = this.head;
    while(temp.next != null){
      if(this.compare(temp.next.value, value)){
        //找到了
        temp.next = temp.next.next;
        this.length--;
        break;
      }
      temp = temp.next;
    }
  }

  find(value){
    if(this.head === null){
      return false;
    }
    var temp = this.head;
    while(temp != null){
      if(this.compare(temp.value, value)){
        //找到了
        return true;
      }
      temp = temp.next;
    }
    return false;
  }

  findByKey(cmp, key){
    if(this.head === null){
      return null;
    }
    var temp = this.head;
    while(temp != null){
      if(cmp(temp.value, key)){
        //找到了
        return temp.value;
      }
      temp = temp.next;
    }
    return null;
  }

  defaultCmp(v1, v2){
    return v1 === v2;
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


  