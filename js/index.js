function  parseLrc() {
    var lines = lrc.split('\n');
    var result = [];
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        var parts = line.split(']');
        var timeStr = parts[0].substr(1);
        var obj = {
            time: parseTime(timeStr),
            words: parts[1]
        };
        result.push(obj);
    }
    return result;
}

function parseTime(timeStr) {
    var parts = timeStr.split(':');
    return +(parts[0]) * 60 + +(parts[1]);
}

var lrcData = parseLrc();

var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container')
}
// lrcData数组中，应该高亮显示的歌词下标
function findIndex() {
    // 当前播放时间
    var curTime = doms.audio.currentTime;
    for (var i = 0; i < lrcData.length; i++) {
        if (curTime < lrcData[i].time) {
            return i - 1;
        }
    }

    return lrcData.length - 1;
}

//界面
function createLrcElements() {
    console.log(lrcData)
    var frag = document.createDocumentFragment();//文档片段
    for(var i = 0; i < lrcData.length; i++) {
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        frag.appendChild(li);//改动了dom树
    }
    doms.ul.appendChild(frag);
}

createLrcElements();


var containerHeight = doms.container.clientHeight;
var liHeight = doms.ul.children[0].clientHeight;
var maxOffset = doms.ul.clientHeight - containerHeight;
//设置ul元素的偏移量
function setOffset() {
    console.log('播放')
    var index = findIndex();
    var offset = liHeight * index + liHeight/2 - containerHeight/2;
    if (offset < 0) {
        offset = 0;
    }
    if (offset > maxOffset) {
        offset = maxOffset;
    }
    console.log(offset)
    doms.ul.style.transform = `translateY(-${offset}px)`;
    //去掉之前的高亮
    var li = doms.ul.querySelector('.active');
    if(li) {
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if(li) {
        li.classList.add('active');
    }
}

doms.audio.addEventListener('timeupdate', setOffset);