Baba = require('babascript')
Client = require('babascript-client')

module.exports = function(RED){
  'use strict';
  function BabascriptModule(n){
    RED.nodes.createNode(this, n);
    var node = this;
    this.on("input", function(msg){
      var key = msg.key || n.key
      var name = n.name || msg.name || 'takumibaba'
      if(key != undefined){
        var baba = new Baba(name);
        var options = msg.options || {}
        baba.exec(key, options, function(result){
          node.send({payload: result});
        });
      }
    });
  }
  RED.nodes.registerType("babascript", BabascriptModule, {});

  function BabascriptClientModule(n){
    RED.nodes.createNode(this, n);
    var node = this;
    var name = n.name;
    var client = null;
    if(n.name != undefined){
      console.log(n);
      client = new Client(name);  
      client.on("get_task", function(task){
        var getter = function(){
          return client;
        }
        var p = {getClient: getter, data: task}
        node.send({payload: p});
      });
      client.on("cancel_task", function(task){
        var p = {getClient: getter, data: task}
        node.send({payload: p});
      });
      console.log(client);
    }
    this.on('input', function(msg){
      if(name !== msg.name){
        client = new Client(n.name);
        client.on("get_task", function(task){
          var p = {getClient: getter, data: task}
          node.send({payload: p});
        });
        client.on("cancel_task", function(task){
          var p = {getClient: getter, data: task}
          node.send({payload: p});
        });
      }
    });
  }
  RED.nodes.registerType("babascriptclient", BabascriptClientModule, {});
}