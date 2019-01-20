export {getParamValues, getFlow};


function resolveElements(cfg, vars) {
    switch (cfg.type) {
    //console.log("try");
    case 'Literal':return eval(cfg.raw);
    case 'Identifier':return vars[cfg.name];
    case 'ArrayExpression':return evalArrayExpression(cfg, vars);
    case 'VariableDeclaration':return rowVariableDeclaration(cfg, vars);
    default :return resolveElements2(cfg, vars);
    }
}
function resolveElements2(cfg, vars) {
    switch (cfg.type) {
    case 'BinaryExpression':return eval(resolveElements(cfg.left, vars) + ' ' + cfg.operator + ' ' + resolveElements(cfg.right, vars));
    case 'UnaryExpression':return eval(cfg.operator + '' + resolveElements(cfg.argument, vars));
    case 'UpdateExpression':return rowUpdateExpression(cfg, vars);
    case 'MemberExpression':return vars[cfg.object.name][cfg.property.value];
    default :return resolveElements3(cfg, vars);
    }
}
function resolveElements3(cfg, vars) {
    switch (cfg.type) {
    case 'ReturnStatement':return null;
    case 'AssignmentExpression':return rowAssignmentExpression(cfg, vars);
    }
}


function rowVariableDeclaration(node, vars){
    vars[node.declarations[0].id.name] = resolveElements(node.declarations[0].init,vars);
    //
    return node.declarations[0];
}


function evalArrayExpression(node, vars){
    let index=0;

    let arr = [];
    while(index<node.elements.length){
        arr.push(resolveElements(node.elements[index],vars));
        index++;
    }
    return arr;
}

function rowUpdateExpression(node, vars){
    if(node.operator == '++'){
        return eval(resolveElements(node.argument, vars) + ' + 1');
    }
    else{
        return eval(resolveElements(node.argument, vars) + ' - 1');
    }
}

function rowAssignmentExpression(node, vars){
    if (node.left.type != 'Identifier') vars[node.left.object.name][node.left.property.value] = resolveElements(node.right,vars);
    else vars[node.left.name] = resolveElements(node.right,vars);
    return node.left;
}


function getFlow(cfg, vars){
    if (cfg==undefined ){
        return;
    }
    if (cfg==null){
        return;
    }
    if ('flowstate' in cfg){
        //containe

        getFlow(cfg.false, vars);
        return;
    }

    cfg['flowstate'] = 'approved';

    getFlow(selectNextNode(cfg, vars, resolveElements(cfg.astNode,vars)), vars);
}


function selectNextNode(cfg, vars, res){
    if (res == null){
        return null;
    }
    if('normal' in cfg)
        return cfg.normal;
    else if (!res){
        return cfg.false;
    }
    else{
        return cfg.true;
    }
}

function getParamValues(values, funcParams){
    let paramValues = {};
    if (values.type == 'SequenceExpression') {
        let index=0;
        while(index<funcParams.length){
            let param = funcParams[index];
            paramValues[param.name] = resolveElements(values.expressions[index]);
            index++;
        }
    }
    else{
        paramValues[funcParams[0].name] = resolveElements(values,{});
    }
    return paramValues;
}