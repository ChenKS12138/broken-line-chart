## borken-line-chart(折线图)

### 安装方式
```bash
npm install broken-line-chart
// or
yarn add broken-line-chart
```

### 如何使用

```javascript
const el = document.querySelector("canvas");
const size = {
  width:400,
  height:400
};
const data = [
  {
    lineColor:'rgb(12,142,175)',
    textColor:"rgb(255,255,255)",
    pointColor:'rgb(128, 191, 255)',
    pointSize:4,
    lineWidth:3,
    data:[
      {
      value:0.3,
        text:'16℃',
        offest:-0.2
      },
      {
        value:0.5,
        text:'17℃',
        offest:-0.2
      },
      {
        value:0.8,
        text:'20℃',
        offest:-0.2
      }
      ,
      {
        value:0.8,
        text:'20℃',
        offest:-0.2
      }
    ]
  }
];
const animate = borkenLineChart(el,size,data);
animate();
```

