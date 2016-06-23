import "./saas.jade";
import { Saas } from '../../../api/saas/saasCollections.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { getZmqSub, setZmqPub } from '../../../api/saas/methods.js';
import { log } from '../../../api/logger_conf.js';
//import { nv } from 'meteor/nvd3:nvd3';

Template.saas.onCreated(function onCreatedSaas(){
    let self = this;
    let dataD3 = [
  {
    key: "Cumulative Return",
    values: [
      // {
      //   "label" : "A" ,
      //   "value" : -29.765957771107
      // } ,
      // {
      //   "label" : "B" ,
      //   "value" : 0
      // } ,
      // {
      //   "label" : "C" ,
      //   "value" : 32.807804682612
      // } ,
      // {
      //   "label" : "D" ,
      //   "value" : 196.45946739256
      // } ,
      // {
      //   "label" : "E" ,
      //   "value" : 0.19434030906893
      // } ,
      // {
      //   "label" : "F" ,
      //   "value" : -98.079782601442
      // } ,
      // {
      //   "label" : "G" ,
      //   "value" : -13.925743130903
      // } ,
      // {
      //   "label" : "H" ,
      //   "value" : -5.1387322875705
      // }
    ]
  }
];

  /**
   * Uncomment for use local zmq server on port 4000
   */

  // setZmqPub.call({
  //   zmq_sock: "Set Pub"
  // }, (err, res) => {
  //     if (err) {
  //         //log.error('unexpected error getZmqSub: ', err.message, this.userId);
  //         console.log('unexpected error setZmqPub: ', err.message, err)
  //     } else {
  //       console.log('succes setZmqPub', res);
  //     }
  // });

  reactiveRes = new ReactiveDict('myRes');
  reactiveRes.set('res', Saas.find().count());
  getZmqSub.call({
        zmq_sock: "Get Sub"
      }, (err, res) => {
        if (err) {
          if (err.error === 404) {
            //log.error('404 getZmqSub: error', err.message, this.userId);
            console.log('404 getZmqSub: ', err.message)
            sAlert.error('404 getZmqSub: error: '+err.message);
          } else {
            //log.error('unexpected error getZmqSub: ', err.message, this.userId);
            console.log('unexpected error getZmqSub: ', err.message, err)
            sAlert.error('unexpected zmq: error: '+err.message);
          }
        } else {
          //log.info('success getZmqSub: ', res);
          sAlert.success('zmq successfully subscribe: '+res);
          console.log('succes getZmqSub', reactiveRes.get('res'));
        }
  });
  let Subs = self.subscribe("saas");
  reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
  self.autorun(() => {
    reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
    jsonRes = reactiveRes.get('res');
    try{
      jsonRes = JSON.parse(jsonRes[0].message);
      reactiveRes.set('jsonRes', jsonRes.elapsed);
      console.log('reactiveDict res:', reactiveRes.get('jsonRes'));
    } catch(e){
      console.warn("JSON parse error", e);
    }
    dataD3[0].values.push({
        "label" : reactiveRes.get('jsonRes'),
        "value" : -5.1387322875705
      });

      nv.addGraph(function() {
    var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      .showValues(true)

    d3.select('#chart svg')
      .datum(dataD3)
      .transition().duration(500)
      .call(chart)
      ;

    nv.utils.windowResize(chart.update);

    return chart;
  });
    // d3.select('#chart svg').datum(
    //         [{ values: reactiveRes.get('jsonRes'), key: 'Age' }]
    //       ).call(chart);
    //       chart.update();
  });

  // var chart = nv.models.lineChart()
  //   .margin({left: 100})  //Adjust chart margins to give the x-axis some breathing room.
  //   .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
  //   .transitionDuration(350)  //how fast do you want the lines to transition?
  //   .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
  //   .showYAxis(true)        //Show the y-axis
  //   .showXAxis(true)        //Show the x-axis
  // ;

  // nv.addGraph(function() {
  //       chart.xAxis.axisLabel('Person number').tickFormat(d3.format('d'));
  //       chart.yAxis.axisLabel('Age (years)').tickFormat(d3.format('d'));
  //       d3.select('#chart svg').datum(
  //         [{ values: reactiveRes.get('jsonRes'), key: 'Age' }]
  //       ).call(chart);
  //       nv.utils.windowResize(function() { chart.update(); });
  //       return chart;
  //     });

  // nv.addGraph(function() {
  //         var chart = nv.models.multiBarChart()
  //           .duration(350)
  //           .reduceXTicks(true)   //If 'false', every single x-axis tick label will be rendered.
  //           .rotateLabels(0)      //Angle to rotate x-axis labels.
  //           .showControls(true)   //Allow user to switch between 'Grouped' and 'Stacked' mode.
  //           .groupSpacing(0.1)    //Distance between each group of bars.
  //         ;

  //         chart.xAxis
  //             .tickFormat(d3.format(',f'));

  //         chart.yAxis
  //             .tickFormat(d3.format(',.1f'));

  //         d3.select('#chart svg')
  //             .datum(exampleData())
  //             .call(chart);

  //         nv.utils.windowResize(chart.update);

  //         return chart;
  //     });

  // //Generate some nice data.
  // function exampleData() {
  //   data = [{
  //     key: "oct-docker",
  //     series: 0,
  //     x: 0,
  //     y: 12
  //   }];

  //   return {
  //     key: 'oct docker',
  //     values: data
  //   };
  //   // return stream_layers(3,10+Math.random()*100,.1).map(function(data, i) {
  //   //   console.log(data);
  //   //   return {
  //   //     key: 'Stream #' + i,
  //   //     values: data
  //   //   };
  //   // });
  // }






// dataD3[0].values.push({
//         "label" : "I" ,
//         "value" : -5.1387322875705
//       });

});


Template.saas.helpers({
  getRes (){
    return reactiveRes.get('jsonRes');
  }
});

