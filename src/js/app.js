import $ from 'jquery';
import * as flowchart from 'flowchart.js';
import {parseCode} from './code-analyzer';
import {createGraph, createGraphNode,returnNodeAccordingName} from './drawMyCFG';
import * as esgraph from 'esgraph';
import {getParamValues} from './createNewFlow';
$(document).ready(function () {
    $('#codeSubmissionButton').click(() => {
        $('#CFG').empty();
        let codeToParse = $('#codePlaceholder').val();
        let parsedCode = parseCode(codeToParse);
        let params = parseCode($('#paramsInput').val());
        let paramValues = returnParamValues(params,parsedCode);
        const cfg = createGraph(esgraph(parsedCode.body[0].body), paramValues);
        const cfgStr = esgraph.dot(cfg,{counter: 0});
        $('#parsedCode').val(cfgStr);
        let cfgData = createGraphNode(cfgStr, cfg[2]);
        let diagram = drawGraph(cfgData);
        diagram.drawSVG('CFG',{'yes-text': 'T', 'no-text': 'F', 'flowstate' : {
            'request' : { 'fill' : 'green', 'font-color' : 'green'}, 'invalid': {'font-color' : 'white'}, 'approved' : { 'fill' : 'green' }
        }});
    });
});
function returnParamValues(params,parsedCode){
    if(params.body.length <0 || params.body.length==0){
        return {};
    }
    else
        return getParamValues(params.body[0].expression, parsedCode.body[0].params);
}

function drawGraph(content){
    let graph = '';let val='\n';let arrow= '->';let index=0;
    for(let i=0;i<content[0].length;i++){
        let node_name = content[0][i];
        graph = graph + createStringNode(node_name);
    }
    graph =graph + val;
    while(index<content[1].length){
        let keshet = content[1][index];
        graph =graph + keshet.from;
        if(!graph) {return 'error';}
        else if(returnNodeAccordingName(content[0], keshet.from).type == 'condition'){graph = graph + '(' + keshet.cond + ')';}
        graph =graph + arrow + keshet.to + val;
        index++;
    }
    return flowchart.parse(graph);
}

function createStringNode(input){
    let name=input.name;
    let ind=input.index;
    let type=input.type;
    let text=input.text;
    let flow= input.flowstate;
    let string = name + '=>' + type + ': ';
    if ('index' in input){
        string = string + '(' + ind + ')\n';
    }
    string = string + text;
    if('flowstate' in input){
        string =string + '|' + flow;
    }
    //
    string = string + '\n';
    //add return statment
    return string;
}