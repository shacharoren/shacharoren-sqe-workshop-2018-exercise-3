export {getLabel};

function resolveElements(input) {
    switch (input.type) {
    case 'Literal':return input.raw;
    case 'Identifier':return input.name;
    case 'UpdateExpression':return rowUpdateExpression(input);
    case 'ArrayExpression':return rowArrayExpression(input);
    default :return resolveElements2(input);
    }
}
function resolveElements2(input) {
    switch (input.type) {
    case 'BlockStatement':return rowBlockStatement(input);
    case 'ExpressionStatement':return getLabel(input.expression);
    case 'VariableDeclaration':return getLabel(input.declarations[0].id) + ' = ' + getLabel(input.declarations[0].init);
    case 'BinaryExpression':return getLabel(input.left) + ' ' + input.operator + ' ' + getLabel(input.right);
    default :return resolveElements3(input);
    }
}
function resolveElements3(input) {
    switch (input.type) {
    case 'ReturnStatement':return 'return ' + getLabel(input.argument);
    case 'AssignmentExpression':return getLabel(input.left) + ' ' + input.operator + ' ' + getLabel(input.right);
    case 'WhileStatement':return 'while (' + getLabel(input.test) + ') {\n' + getLabel(input.body) + '\n}';
    case 'IfStatement':return rowIfStatement(input);
    default :return resolveElements4(input);
    }
}
function resolveElements4(input) {
    switch (input.type) {
    case 'MemberExpression':return input.object.name + '[' + getLabel(input.property) + ']';
    case 'UnaryExpression':return input.operator + getLabel(input.argument);
    }
}


function rowBlockStatement(code){
    let res = '';
    for(let i=0;i<code.body.length;i++){
        res += getLabel(code.body[i])+'\n';
    }
    return res;

}

function rowArrayExpression(input){
    let index=0;
    let res = [];
    let exp=input.elements.length;
    while(index<exp){
        let insert=getLabel(input.elements[index]);
        res.push(insert);
        index++;
    }
    return '[' + res.join(', ') + ']';
}



function rowUpdateExpression(input){
    if(input.prefix){
        return input.operator + getLabel(input.argument);
    }
    else{
        return getLabel(input.argument) + input.operator;
    }
}



function rowIfStatement(input){
    let temp = getLabel(input.alternate);
    if(temp != ''){
        //add
        temp ='else ' +temp;
    }
    return 'if (' + getLabel(input.test) + ') {\n' + getLabel(input.consequent) + '\n} ' + temp;
}



function getLabel(input){
    if (input == undefined ||input==null){
        return '';
    }
    //
    return resolveElements(input);

}