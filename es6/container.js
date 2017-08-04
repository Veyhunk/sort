class Container {
    constructor(element, numbers, isMerageSort) {
        this.container = element;
        this.numbers = numbers;
        this.dataIndex = null; //记录元素坐标
        this.isMerageSort = isMerageSort;
        console.log(isMerageSort);

        this.labelHeight = 20;
        this.xUnit = null;
        this.yUnit = null;
        
        this.swapTimeout = 1000;
        this.swapTimer = null;

        this.defaultColor = '#2980B9';

        if(isMerageSort) {
            this.midHeight = this.container.offsetHeight / 2;
        } else {
            this.midHeight = this.container.offsetHeight;
        }
        this.moveDownTimer = null;
        this.moveUpTimer = null;
        this.moveDownTimeout = 1000;
        this.moveUpTimeout = 1000;
        this.swapTimeout = 300;
        this.tempDataIndex = null;
        this.flag0 = false;
    }
    reset() {
        clearInterval(this.moveDownTimer);
        clearInterval(this.moveUpTimer);
        clearInterval(this.swapTimer);
    }
    init() {
        this.container.innerHTML = '';
        //查找最大元素值，初始化元素坐标数组
        var max = this.numbers[0];
        this.dataIndex = new Array(this.numbers.length);
        for(let i = 0; i < this.numbers.length; i++) {
            this.dataIndex[i] = i;
            if(max < this.numbers[i]) {
                max = this.numbers[i];
            }
        }
        //初始化坐标x轴，y轴单位长度
        this.xUnit = Math.floor(this.container.offsetWidth / this.numbers.length);
        this.yUnit = Math.floor((this.midHeight - this.labelHeight) / Math.ceil(max));
        //创建元素
        for(let i = 0; i < this.numbers.length; i++) {
            let number = this._createNumber(i);
            this.container.appendChild(number);
        }
    }
    clearColumnColor() {
        for(let i = 0; i < this.container.children.length; i++) {
            this.container.children[i].getElementsByClassName('column')[0].style.backgroundColor = this.defaultColor;
        }
    }
    labelColor(index, color) {
        this.container.children[this.dataIndex[index]].getElementsByClassName('label')[0].style.backgroundColor = color;
    }
    columnColor(index, color) {
        this.container.children[this.dataIndex[index]].getElementsByClassName('column')[0].style.backgroundColor = color;
    }
    swap(index1, index2) {
        var obj1 = this.container.children[this.dataIndex[index1]];
        var obj2 = this.container.children[this.dataIndex[index2]];
        //处理元素坐标数组
        var temp = this.dataIndex[index1];
        this.dataIndex[index1] = this.dataIndex[index2];
        this.dataIndex[index2] = temp;
        //处理元素
        var left1 = null;
        var left2 = null;
        if(obj1.offsetLeft > obj2.offsetLeft) {
            var temp = obj1;
            obj1 = obj2;
            obj2 = temp;
            left1 = this._getOrginLeft(index1);
            left2 = this._getOrginLeft(index2);
        } else {
            left1 = this._getOrginLeft(index1);
            left2 = this._getOrginLeft(index2);
        }
        //计算动画帧数
        var nums = Math.ceil(this.swapTimeout / 30);
        //计算动画速度
        var speed = (left2 - left1) / nums;
        var flag = 0;
        function handler(_this) {
            flag++;
            if(flag >= nums) {
                clearInterval(_this.swapTimer);
                obj1.style.left = left2 + 'px';
                obj2.style.left = left1 + 'px';
                return;
            }
            obj1.style.left = obj1.offsetLeft + speed + 'px';
            obj2.style.left = obj2.offsetLeft - speed + 'px';
        }
        handler(this);
        clearInterval(this.swapTimer);
        this.swapTimer = this.animate(handler, 30, this);
    }
    moveDown(index1, index2) {
        if(!this.flag0) {
            this.flag0 = true;
            this.tempDataIndex = this.dataIndex.slice();
        }
        this.tempDataIndex[index2] = this.dataIndex[index1];
        var obj1 = this.container.children[this.dataIndex[index1]];
        var endBottom = 0;
        var endLeft = this._getOrginLeft(index2);
        var leftDistance = endLeft - obj1.offsetLeft;
        var nums = Math.ceil(this.moveDownTimeout / 30);
        var leftSpeed = Math.ceil(leftDistance / nums);
        var bottomSpeed = Math.ceil(this.midHeight / nums);
        var flag = 0;
        function handler(_this) {
            flag++;
            if(flag >= nums) {
                clearInterval(_this.moveDownTimer);
                obj1.style.left = endLeft + 'px';
                obj1.style.bottom = endBottom + 'px';
                return;
            }
            obj1.style.left = obj1.offsetLeft + leftSpeed + 'px';
            obj1.style.bottom = parseInt(obj1.style.bottom) - bottomSpeed + 'px';
        }
        handler(this);
        clearInterval(this.moveDownTimer);
        this.moveDownTimer = this.animate(handler, this.moveDownSpeed, this);
    }
    moveUp(index1, index2) {
        var obj1 = this.container.children[this.dataIndex[index1]];
        var endBottom = this.midHeight;
        var endLeft = this.getOrginLeft(index2);
        var leftDistance = endLeft - obj1.offsetLeft;
        var nums = Math.ceil(this.moveUpTimeout / 30);
        var leftSpeed = leftDistance / nums;
        var bottomSpeed = this.midHeight / nums;
        var flag = 0;
        function handler(_this) {
            flag++;
            if(flag >= nums) {
                clearInterval(_this.moveUpTimer);
                obj1.style.left = endLeft + 'px';
                obj1.style.bottom = endBottom + 'px';
                return;
            }
            obj1.style.left = obj1.offsetLeft + leftSpeed + 'px';
            obj1.style.bottom = parseInt(obj1.style.bottom) + bottomSpeed + 'px';
        }
        handler(this);
        clearInterval(this.moveUpTimer);
        this.moveUpTimer = this.animate(handler, this.moveDownSpeed, this);
    }
    moveUp2(start, end) {
        var endBottom = this.midHeight;
        var nums = Math.ceil(this.moveUpTimeout / 30);
        var bottomSpeed = this.midHeight / nums;
        var flag = 0;
        function handler(_this) {
            flag++;
            if(flag >= nums) {
                clearInterval(_this.moveUpTimer);
                for(let i = start; i <= end; i++) {
                    var obj1 = _this.container.children[_this.dataIndex[i]];
                    obj1.style.bottom = endBottom + 'px';
                }
                if(_this.flag0) {
                    _this.flag0 = false;
                    _this.dataIndex = _this.tempDataIndex.slice();
                }
                return;
            }
            for(let i = start; i <= end; i++) {
                var obj1 = _this.container.children[_this.dataIndex[i]];
                obj1.style.bottom = parseInt(obj1.style.bottom) + bottomSpeed + 'px';
            }
        }
        handler(this);
        clearInterval(this.moveUpTimer);
        this.moveUpTimer = this.animate(handler, this.moveDownSpeed, this);
    }
    animate(callback, timeout, param) {
        var args = Array.prototype.slice.call(arguments,2); 
        var _cb = function() { 
            callback.apply(null,args); 
        }
        return setInterval(_cb,timeout); 
    }
    timeoutAnimate(callback, timeout, param) {
        var args = Array.prototype.slice.call(arguments,2); 
        var _cb = function() { 
            callback.apply(null,args); 
        }
        return setTimeout(_cb,timeout); 
    }
    _getOrginLeft(index) {
        return this.xUnit * index + index * 0.1;
    }
    _createNumber(index) {
        var oDiv = document.createElement('div');
        oDiv.className = 'number';
        oDiv.style.width = this.xUnit * 0.8 + 'px';
        oDiv.style.height = this.yUnit * this.numbers[index] + this.labelHeight + 'px';
        oDiv.style.left = this.xUnit * index + index * 0.1;
        if(this.isMerageSort) {
            oDiv.style.bottom = this.midHeight;
        } else {
            oDiv.style.bottom = 0;
        }
        var column =  document.createElement('div');
        column.className = 'column';
        column.style.width = '100%';
        column.style.height = this.yUnit * this.numbers[index] + 'px';
        var label = document.createElement('div');
        label.innerHTML = this.numbers[index];
        label.className = 'label';
        label.style.width = '100%';
        label.style.height = this.labelHeight + 'px';
        oDiv.appendChild(column);
        oDiv.appendChild(label);
        return oDiv;
    }
}