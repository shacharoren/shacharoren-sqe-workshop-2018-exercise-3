import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';
/*import {createGraph,buildCFGNodes} from '../src/js/drawMyCFG';
import * as esgraph from 'esgraph';
import {getParamValues} from '../src/js/createNewFlow';*/


describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '{"type":"Program","body":[],"sourceType":"script"}'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}'
        );
    });

});

/*

function makeGraphString(func,vals){
    let parsedFunc = parseCode(func);
    const cfg = createGraph(getGraph(parsedFunc),getParams(parsedFunc,vals));
    const cfgStr = esgraph.dot(cfg);
    return buildCFGNodes(cfgStr,cfg[2]);
}

function getGraph(func){
    return esgraph(func.body[0].body);
}

function getParams(func,vals){
    let paramVals = parseCode(vals);
    return paramVals.body.length >0? getParamValues(paramVals.body[0].expression, func.body[0].params):{};
}
*/
