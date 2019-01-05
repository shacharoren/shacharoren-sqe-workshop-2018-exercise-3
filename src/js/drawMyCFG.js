import {getLabel} from './getMyLab';
import {getFlow} from './createNewFlow';
export {createGraph, createGraphNode,returnNodeAccordingName};

function labShow(input){
    input[2].forEach(function(value) {
        //
        //
        value.label = getLabel(value.astNode);
    });


    return input;
}

function createNextNode(val, item, next){
    if('normal' in val){
        val.normal = next;
    }
    else if (val.true.astNode != item.astNode){
        val.false = next;

    }
    else{
        val.true = next;
    }
    return val;
}

function remove(item) {
    let index=0;
    while(index< item.prev.length){
        item.prev[index] = createNextNode(item.prev[index],item,item.normal);
        index++;
    }

    item.normal.prev = item.prev;

}

function changeGraph(input){
    let num=0;
    input[num] = input[num].next;
    delete input[num+2][num];
    //console.log(input[num+2][num+1].parent);
    input[num+2][num+1].parent = undefined;
    input[num+2][num+1].prev = [];
    let index=1;
    while(index<input[num+2].length){
        let node = input[num+2][index];
        delete node.exception;
        if (node.label == ''){delete input[num+2][index];}
        else if (node.label.startsWith('return ')){delete node.normal;}
        index++;
    }
    input[num+2] = input[num+2].filter(value => Object.keys(value).length !== 0);
    //
    return input;

}

function combineAll(input){
    let index=0;
    let length=input[2].length;
    let value=input[2];
    while(index<length){
        if ('normal' in value[index]){
            if (value[index].normal.prev.length == 1){
                if(!('true' in value[index].normal)) {
                    value[index].normal.label = value[index].label + '\n' + value[index].normal.label;
                    remove(value[index]);
                    delete input[2][index];
                }
            }
        }
        index++;
    }
    input=extra(input);
    return input;
}

function extra(input){
    input[2] = input[2].filter(value => Object.keys(value).length !== 0);
    let index=0;
    while(index<input[2].length){
        input[2][index].xlabel = ''+index;
        index++;
    }
    return input;
}

function createGraph(cfg, params){
    let num=0;
    let newCFG = changeGraph(labShow(cfg));
    //
    getFlow(newCFG[num][num],params);
    //
    return combineAll(newCFG);

}

function returnNode(input){
    return {name: input.split(' [label="')[0], index: parseInt(input.split(' [label="')[0].substring(1)), text: input.split(' [label="')[1].substring(0,input.split(' [label="')[1].lastIndexOf('"'))};
}

function returnTra(trStr){
    let num=0;
    let cond = trStr.split(' ')[num+3].substring(trStr.split(' ')[num+3].indexOf('[') +1);
    let temp;
    if(cond.indexOf('"') != -1){
        temp=cond.substring(cond.indexOf('"') + 1,cond.lastIndexOf('"'));
    }
    else{temp='';}
    if(temp !== '')
        if(temp == 'false'){
            temp='no';
        }
        else{
            temp='yes';
        }
    return {
        from: trStr.split(' ')[num], to: trStr.split(' ')[num+2],cond: temp
    };
}

function changeNodeInGraph(input, values){
    let vars = [];
    let arr = [];
    let index=0;
    while(index<returnGraphLines(input).length) {
        if (returnGraphLines(input)[index].indexOf('->') != -1) {
            if (returnTra(returnGraphLines(input)[index]).cond != '') {returnNodeAccordingName(vars, returnTra(returnGraphLines(input)[index]).from).type = 'condition';}
            else {returnNodeAccordingName(vars, returnTra(returnGraphLines(input)[index]).from).type = 'operation';}
            arr.push(returnTra(returnGraphLines(input)[index]));
        }
        else {
            let node = returnNode(returnGraphLines(input)[index]);
            node.flowstate = returnStatus(returnNode(returnGraphLines(input)[index]).text, values);
            vars.push(node);
        }
        index++;
    }
    return [vars, arr];
}

function createGraphNode(input, values){
    let vars_arr = changeNodeInGraph(input, values);
    return changeAllMarge(vars_arr[0], vars_arr[1]);
}

function returnGraphLines(cfgStr){
    let array = [];
    let begin = 0;
    let index=0;
    let counter = 0;
    let num=2;
    while(index<cfgStr.length){
        if(cfgStr.charAt(index) == ']'){
            counter=counter-1;
            if(counter == 0){
                array.push(cfgStr.substring(begin,index));
                begin = index + num;
            }
        }
        if(cfgStr.charAt(index) == '[') {counter=counter+1;}
        index++;
    }
    return array;
}

function changeAllMarge(vars, input){
    let num = 0;
    let index=0;
    let nodesNum = vars.length;
    for (let v=0;v<nodesNum;v++){
        if (vars[v].type == undefined){vars[v].type = 'operation';}
        let inTrs = input.filter(tr => tr.to == vars[v].name);
        if(inTrs.length > 1){
            let node = {name: 'm'+num, text: ' \\\\', type: 'start'};
            input = input.filter(tr => tr.to !== vars[v].name);
            node.flowstate = retunFlowStatus(inTrs, vars);vars.push(node);index=0;
            while(index<inTrs.length){
                input.push({from:inTrs[index].from, to: 'm'+num, cond: inTrs[index].cond});
                index++;
            }
            input.push({from: 'm'+num, to: vars[v].name, cond: ''});num=num+1;
        }
    }
    return [vars,sortByTrans(input,vars.length)];
}

// eslint-disable-next-line complexity
function sortByTrans(transitions,regNodes){
    let arr = [];
    let i = 0;
    let first_letter = 'n';
    let j;
    while(arr.length < transitions.length){j=0;
        while(j<transitions.length){
            if(transitions[j].from.startsWith(first_letter)){
                if(parseInt(transitions[j].from.substring(1)) == i){
                    arr.push(transitions[j]);
                }}j++;}
        if(regNodes != i){i++;}
        else{
            first_letter = 'm';
            i = 0;
        }
    }
    return arr;
}

function returnStatus(txt, arr) {
    let index=0;
    let state;
    while(index<arr.length){
        if (arr[index].label != txt){
            state=undefined;
        }
        else{
            state = arr[index].flowstate;
            break;
            //
        }
        index++;
    }
    return state;

}

function retunFlowStatus(input, arr) {
    let index=0;
    let val1= 'request';
    let val2= 'approved';
    let val3= 'invalid';
    while(index<input.length){
        let pos=returnNodeAccordingName(arr, input[index].from);
        let con=pos.flowstate;
        if(con == val2){
            return val1;

        }
        index++;
    }
    return val3;

}

function returnNodeAccordingName(nodes, name){
    for(let i=0;i<nodes.length;i++){
        if (nodes[i].name == name)
            return nodes[i];
    }
    //return null;
}
