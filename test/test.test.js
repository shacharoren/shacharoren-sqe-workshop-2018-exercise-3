import assert from 'assert';
import * as esgraph from 'esgraph';
import {parseCode} from '../src/js/code-analyzer';
import {getParamValues} from '../src/js/createNewFlow';
import {createGraphNode, createGraph} from '../src/js/drawMyCFG';


describe('create graph', () => {
    it('Empty func', () => {
        let parsedFunc = parseCode('function poo(){\n' + 'return;\n' + '}');
        let ret;
        if(parseCode('').body.length >0){
            ret= getParamValues(parseCode('').body[0].expression, parsedFunc.body[0].params);
        }
        else{
            ret={};
        }
        const temp = createGraph(esgraph(parsedFunc.body[0].body), ret);
        const val = esgraph.dot(temp);
        let res = createGraphNode(val, temp[2]);
        let expected1= [ {name: 'n0', index: 0, text: 'return ', flowstate: 'approved', type: 'operation'}];
        let expected2= [];
        assert.deepEqual(res[0],expected1);
        assert.deepEqual(res[1],expected2);
    });
});
describe('create graph', () => {
    it('simple graph', () => {
        let parsedFunc = parseCode('function poo(y,z){\n' + 'return z;\n' + '}');
        let ret;
        if(parseCode('1, 2').body.length >0){
            ret= getParamValues(parseCode('1, 2').body[0].expression, parsedFunc.body[0].params);
        }
        else{
            ret={};
        }
        let temp = createGraph(esgraph(parsedFunc.body[0].body), ret);
        let val = esgraph.dot(temp);
        let res = createGraphNode(val, temp[2]);
        let expected1= [ {name: 'n0', index: 0, text: 'return z', flowstate: 'approved', type: 'operation'}];
        let expected2= [];
        assert.deepEqual(res[0],expected1);
        assert.deepEqual(res[1],expected2);

    });
});
describe('create graph', () => {
    it('simple array', () => {
        let parsedFunc = parseCode('function poo(poopi){\n' +
            '    let fufi = 2*poopi[0] + 500;\n' +
            '    return fufi + poopi[1];\n' +
            '}\n');
        let paramVals = parseCode('[1,2,3]');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let except1=[{name: 'n0', index: 0, text: 'fufi = 2 * poopi[0] + 500\nreturn fufi + poopi[1]', flowstate: 'approved', type: 'operation'}];
        let except2=[];
        assert.deepEqual(temp[0],except1);
        assert.deepEqual(temp[1],except2);});
});
describe('create graph', () => {
    it('WHILE statment', () => {
        let parsedFunc = parseCode('function foo(z, p){\n' +
            'let q = -z;\n' +
            'let b = [6, 5];\n' +
            'while (q < b[0]) {p = p + 3;\n' +
            'q++;}\n' +
            'return p;\n' + '}');
        let paramVals = parseCode('2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=[
            {name: 'n0', index: 0, text: 'q = -z\nb = [6, 5]', flowstate: 'approved', type: 'operation'}, {name: 'n1', index: 1, text: 'q < b[0]', flowstate: 'approved', type: 'condition'}, {name: 'n2', index: 2, text: 'p = p + 3\nq++', flowstate: 'approved', type: 'operation'}, {name: 'n3', index: 3, text: 'return p', flowstate: 'approved', type: 'operation'}, {name: 'm0', text: ' \\\\', flowstate: 'request', type: 'start'}];
        let expected2=[{from: 'n0', to: 'm0', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},
            {from: 'n1', to: 'n3', cond: 'no'},{from: 'n2', to: 'm0', cond: ''},{from: 'm0', to: 'n1', cond: ''}];
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);});
});
describe('create graph', () => {
    it('if else statment', () => {
        let parsedFunc = parseCode('function foo(x, y, z){\n' +
            'let a = x + 1;\n' +
            'let b = a + y;\n' +
            'let c = 0;\n' +
            'if (b < --z[0]) {c = c + 5;\n' +
            '} else if (b < z[1] * 2) {c = c + x + 5;\n' +
            '} else {c = c + z[2] + 5;}\n' + 'return y;}');
        let paramVals = parseCode('1, 2, [1, 2, 3]');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=arr();
        let expected2=arr2();
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
function arr(){
    return [{name: 'n0', index: 0, text: 'a = x + 1\nb = a + y\nc = 0', flowstate: 'approved', type: 'operation'},
        {name: 'n1', index: 1, text: 'b < --z[0]', flowstate: 'approved', type: 'condition'},
        {name: 'n2', index: 2, text: 'c = c + 5', flowstate: undefined, type: 'operation'},
        {name: 'n3', index: 3, text: 'return y', flowstate: 'approved', type: 'operation'},
        {name: 'n4', index: 4, text: 'b < z[1] * 2', flowstate: 'approved', type: 'condition'},
        {name: 'n5', index: 5, text: 'c = c + x + 5', flowstate: undefined, type: 'operation'},
        {name: 'n6', index: 6, text: 'c = c + z[2] + 5', flowstate: 'approved', type: 'operation'},
        {name: 'm0', text: ' \\\\', flowstate: 'request', type: 'start'}];
}
function arr2(){
    return[{from: 'n0', to: 'n1', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},{from: 'n1', to: 'n4', cond: 'no'},
        {from: 'n2', to: 'm0', cond: ''},{from: 'n4', to: 'n5', cond: 'yes'},{from: 'n4', to: 'n6', cond: 'no'},
        {from: 'n5', to: 'm0', cond: ''},{from: 'n6', to: 'm0', cond: ''},{from: 'm0', to: 'n3', cond: ''}];
}
describe('create graph', () => {
    it('is making a cfg with nested if correctly', () => {
        let parsedFunc = parseCode('function foo(p, h, z){\n' +
            'let w = p + 2;\n' +
            'let j = w + h;\n' +
            'let f = [1, 2];\n' +
            'if (j < z) {\n' +
            'f[0] = f[1] + 8;\n' +
            'if (f[0] < p){h++;} \n' + 'else {f[1] = 5;}\n' + 'f[0] = f[1] * p;}\n' + 'return h;}');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=expected3();
        let expected2=expected4();
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
function expected3() {
    return [{name: 'n0', index: 0, text: 'w = p + 2\nj = w + h\nf = [1, 2]', flowstate: 'approved', type: 'operation'},
        {name: 'n1', index: 1, text: 'j < z', flowstate: 'approved', type: 'condition'},
        {name: 'n2', index: 2, text: 'f[0] = f[1] + 8', flowstate: undefined, type: 'operation'},
        {name: 'n3', index: 3, text: 'f[0] < p', flowstate: undefined, type: 'condition'},
        {name: 'n4', index: 4, text: 'h++', flowstate: undefined, type: 'operation'},
        {name: 'n5', index: 5, text: 'f[0] = f[1] * p', flowstate: undefined, type: 'operation'},
        {name: 'n6', index: 6, text: 'f[1] = 5', flowstate: undefined, type: 'operation'},
        {name: 'n7', index: 7, text: 'return h', flowstate: 'approved', type: 'operation'},
        {name: 'm0', text: ' \\\\', flowstate: 'invalid', type: 'start'},
        {name: 'm1', text: ' \\\\', flowstate: 'request', type: 'start'}];
}
function expected4(){
    return [{from: 'n0', to: 'n1', cond: ''},
        {from: 'n1', to: 'n2', cond: 'yes'},
        {from: 'n1', to: 'm1', cond: 'no'},
        {from: 'n2', to: 'n3', cond: ''},
        {from: 'n3', to: 'n4', cond: 'yes'},
        {from: 'n3', to: 'n6', cond: 'no'},
        {from: 'n4', to: 'm0', cond: ''},
        {from: 'n5', to: 'm1', cond: ''},
        {from: 'n6', to: 'm0', cond: ''},
        {from: 'm0', to: 'n5', cond: ''},
        {from: 'm1', to: 'n7', cond: ''}];
}
describe('create graph', () => {
    it('is making a cfg with nested executed if correctly', () => {
        let parsedFunc = parseCode('function foo(p, q, f){\n' +
            'let w = p + 1;\n' + 'let o = w + q;\n' + 'let j = [1, 2];\n' +
            'if (o > f) {j[0] = j[1] + 6;\n' +
            'if(j[0] < p){q++;} \n' +
            'else {j[1] = 3;}\n' +
            'j[1] = j[1] * p;}\n' +
            'return q;}');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=expected5();
        let expected2=expected6();
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
function expected5(){
    return [{name: 'n0', index: 0, text: 'w = p + 1\no = w + q\nj = [1, 2]', flowstate: 'approved', type: 'operation'},
        {name: 'n1', index: 1, text: 'o > f', flowstate: 'approved', type: 'condition'},
        {name: 'n2', index: 2, text: 'j[0] = j[1] + 6', flowstate: 'approved', type: 'operation'},
        {name: 'n3', index: 3, text: 'j[0] < p', flowstate: 'approved', type: 'condition'},
        {name: 'n4', index: 4, text: 'q++', flowstate: undefined, type: 'operation'},
        {name: 'n5', index: 5, text: 'j[1] = j[1] * p', flowstate: 'approved', type: 'operation'},
        {name: 'n6', index: 6, text: 'j[1] = 3', flowstate: 'approved', type: 'operation'},
        {name: 'n7', index: 7, text: 'return q', flowstate: 'approved', type: 'operation'},
        {name: 'm0', text: ' \\\\', flowstate: 'request', type: 'start'},
        {name: 'm1', text: ' \\\\', flowstate: 'request', type: 'start'}];
}
function expected6(){
    return [{from: 'n0', to: 'n1', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},{from: 'n1', to: 'm1', cond: 'no'},
        {from: 'n2', to: 'n3', cond: ''},{from: 'n3', to: 'n4', cond: 'yes'},{from: 'n3', to: 'n6', cond: 'no'},
        {from: 'n4', to: 'm0', cond: ''},{from: 'n5', to: 'm1', cond: ''},{from: 'n6', to: 'm0', cond: ''},
        {from: 'm0', to: 'n5', cond: ''},{from: 'm1', to: 'n7', cond: ''}];
}
describe('create graph', () => {
    it('is making a cfg with several lines in if correctly', () => {
        let parsedFunc = parseCode('function foo(p, o, f){\n' +
            'let x = p + 1;\n' +
            'let j = x + o;\n' +
            'let k = 0;\n' +
            'if (j > f) {k = k + 6;\n' +
            'o = k - p;\n' +
            'x = x * j / 2;\n' + '}\n' + 'return o + 1;}');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=[{name: 'n0', index: 0, text: 'x = p + 1\nj = x + o\nk = 0', flowstate: 'approved', type: 'operation'}, {name: 'n1', index: 1, text: 'j > f', flowstate: 'approved', type: 'condition'}, {name: 'n2', index: 2, text: 'k = k + 6\no = k - p\nx = x * j / 2', flowstate: 'approved', type: 'operation'}, {name: 'n3', index: 3, text: 'return o + 1', flowstate: 'approved', type: 'operation'}, {name: 'm0', text: ' \\\\', flowstate: 'request', type: 'start'}];
        let expected2=[{from: 'n0', to: 'n1', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},{from: 'n1', to: 'm0', cond: 'no'}, {from: 'n2', to: 'm0', cond: ''},{from: 'm0', to: 'n3', cond: ''}];
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
describe('create graph', () => {
    it('is making a cfg with several lines in else correctly', () => {
        let parsedFunc = parseCode('function foo(i, w, z){\n' +
            'let q = i + 1;\n' +
            'let k = q + w;\n' +
            'let l = 0;\n' +
            'if (k < z) {l = l + 5;}\n' + 'else {l = l + 3;\n' +
            'w = 3 - i;\n' + 'q = q * k / 5;\n' +
            '}\n' + 'return w;\n' + '}');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=expected7();
        let expected2=[{from: 'n0', to: 'n1', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},{from: 'n1', to: 'n4', cond: 'no'}, {from: 'n2', to: 'm0', cond: ''},{from: 'n4', to: 'm0', cond: ''},{from: 'm0', to: 'n3', cond: ''}];
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
function expected7(){
    return [{name: 'n0', index: 0, text: 'q = i + 1\nk = q + w\nl = 0', flowstate: 'approved', type: 'operation'},
        {name: 'n1', index: 1, text: 'k < z', flowstate: 'approved', type: 'condition'},
        {name: 'n2', index: 2, text: 'l = l + 5', flowstate: undefined, type: 'operation'},
        {name: 'n3', index: 3, text: 'return w', flowstate: 'approved', type: 'operation'},
        {name: 'n4', index: 4, text: 'l = l + 3\nw = 3 - i\nq = q * k / 5', flowstate: 'approved', type: 'operation'},
        {name: 'm0', text: ' \\\\', flowstate: 'request', type: 'start'}];
}
describe('create graph', () => {
    it('is making a complex cfg correctly', () => {
        let parsedFunc = parseCode('function xoxo(x, w, z){\n' + 'let a = x + 2;\n' + 'let b = a + w;\n' + 'let c = 0;\n' + 'if (b < z) {c = c + 5;\n' + 'c++;\n' + 'a++;} else if (b < z * 2) {\n' + 'c = c + x + 5;\n' + 'b++;\n' + 'z++;\n' + '} else {c = c + z + 5;\n' +
            'a--;\n' +
            'x = x * w;\n' +
            '}\n' +
            'a = b;\n' +
            'b = c + 1;\n' +
            'return c;}');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=[{name: 'n0', index: 0, text: 'a = x + 2\nb = a + w\nc = 0', flowstate: 'approved', type: 'operation'}, {name: 'n1', index: 1, text: 'b < z', flowstate: 'approved', type: 'condition'}, {name: 'n2', index: 2, text: 'c = c + 5\nc++\na++', flowstate: undefined, type: 'operation'}, {name: 'n3', index: 3, text: 'a = b\nb = c + 1\nreturn c', flowstate: 'approved', type: 'operation'}, {name: 'n4', index: 4, text: 'b < z * 2', flowstate: 'approved', type: 'condition'}, {name: 'n5', index: 5, text: 'c = c + x + 5\nb++\nz++', flowstate: 'approved', type: 'operation'}, {name: 'n6', index: 6, text: 'c = c + z + 5\na--\nx = x * w', flowstate: undefined, type: 'operation'}, {name: 'm0', text: ' \\\\', type: 'start', flowstate: 'request'}];
        let expected2=[{from: 'n0', to: 'n1', cond: ''},{from: 'n1', to: 'n2', cond: 'yes'},{from: 'n1', to: 'n4', cond: 'no'}, {from: 'n2', to: 'm0', cond: ''},{from: 'n4', to: 'n5', cond: 'yes'},{from: 'n4', to: 'n6', cond: 'no'}, {from: 'n5', to: 'm0', cond: ''},{from: 'n6', to: 'm0', cond: ''},{from: 'm0', to: 'n3', cond: ''}];
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});
describe('create graph', () => {
    it('WHILE check', () => {
        let parsedFunc = parseCode('function foo(x, y, z){\n' + '   let a = x + 1;\n' + '   let b = a + y;\n' + '   let c = 0;\n' + '   \n' + '   while (a < z) {\n' + '       c = a + b;\n' + '       z = c * 2;\n' + '       a++;\n' + '   }\n' + '   \n' + '   return z;\n' + '}\n');
        let paramVals = parseCode('1, 2, 3');
        let ret_param= paramVals.body.length >0? getParamValues(paramVals.body[0].expression, parsedFunc.body[0].params):{};
        let graph = createGraph(esgraph(parsedFunc.body[0].body), ret_param);
        let graphStr = esgraph.dot(graph);
        let temp = createGraphNode(graphStr, graph[2]);
        let expected1=[{name: 'n0', index: 0, text: 'a = x + 1\nb = a + y\nc = 0', flowstate: 'approved', type: 'operation'}, {name: 'n1', index: 1, text: 'a < z', flowstate: 'approved', type: 'condition'}, {name: 'n2', index: 2, text: 'c = a + b\nz = c * 2\na++', flowstate: 'approved', type: 'operation'}, {name: 'n3', index: 3, text: 'return z', flowstate: 'approved', type: 'operation'}, {name: 'm0', text: ' \\\\', type: 'start', flowstate: 'request'}];
        let expected2=[
            {from: 'n0', to: 'm0', cond: ''},
            {from: 'n1', to: 'n2', cond: 'yes'},
            {from: 'n1', to: 'n3', cond: 'no'},
            {from: 'n2', to: 'm0', cond: ''},
            {from: 'm0', to: 'n1', cond: ''}];
        assert.deepEqual(temp[0],expected1);
        assert.deepEqual(temp[1],expected2);
    });
});




