import "./saas.jade";
import { Saas } from '../../../api/saas/saasCollections.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { getZmqSub, setZmqPub } from '../../../api/saas/methods.js';
import { log } from '../../../api/logger_conf.js';
//import { nv } from 'meteor/nvd3:nvd3';

Template.saas.onCreated(function onCreatedSaas(){
    let self = this;

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
  let sin = [],
      cos = [];
  let data = function(obj) {
    //let obj =  reactiveRes.get('jsonRes');
    sin.push({x: obj.elapsed, y: obj.scriptrun_time});
    return [
      {
        values: sin,
        key: 'Sine Wave',
        color: '#ff7f0e'
      },
      {
        values: cos,
        key: 'Cosine Wave',
        color: '#2ca02c'
      }
    ];
  }
  self.autorun(() => {
    reactiveRes.set('res', Saas.find({}, {sort: {_id: -1}, limit:1}).fetch());
    jsonRes = reactiveRes.get('res');
    try{
      jsonRes = JSON.parse(jsonRes[0].message);
      reactiveRes.set('jsonRes', {
        scriptrun_time: jsonRes.scriptrun_time,
        elapsed: jsonRes.elapsed,
        custom_timers: jsonRes.custom_timers,
        epoch: jsonRes.epoch
      });
      // try to build nvd3 chart
      try{
        let tmpObj = reactiveRes.get('jsonRes');

        nv.addGraph(function() {
          var chart = nv.models.lineChart()
            .useInteractiveGuideline(true)
            ;

          chart.xAxis
            .axisLabel('Test Elapsed Time (ms)')
            .tickFormat(d3.format(',r'))
            ;

          chart.yAxis
            .axisLabel('Run Time (ms)')
            .tickFormat(d3.format('.02f'))
            ;

          d3.select('#chart svg')
            .datum(data(tmpObj))
            .transition().duration(500)
            .call(chart)
            ;

          nv.utils.windowResize(chart.update);

          return chart;
        });
      } catch(e){
        console.warn("chart data is not ready", e);
      }
      //console.log('reactiveDict res:', reactiveRes.get('jsonRes'));
    } catch(e){
      console.warn("JSON parse error", e);
    }
  });
});


Template.saas.helpers({
  getRes (){
    try{
      let res = reactiveRes.get('jsonRes');
      return res.elapsed;
    }catch(e){
      console.warn("jsonRes not ready ", e);
    }
  }
});

