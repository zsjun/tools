class JSEmitter {
  // 遍历声明的变量
  // var a = 1; 转成ast
  // {
  //   "type": "Program",
  //   "start": 0,
  //   "end": 9,
  //   "body": [
  //     {
  //       "type": "VariableDeclaration",
  //       "start": 0,
  //       "end": 9,
  //       "declarations": [
  //         {
  //           "type": "VariableDeclarator",
  //           "start": 4,
  //           "end": 9,
  //           "id": {
  //             "type": "Identifier",
  //             "start": 4,
  //             "end": 5,
  //             "name": "a"
  //           },
  //           "init": {
  //             "type": "Literal",
  //             "start": 8,
  //             "end": 9,
  //             "value": 1,
  //             "raw": "1"
  //           }
  //         }
  //       ],
  //       "kind": "var"
  //     }
  //   ],
  //   "sourceType": "module"
  // }
  // 遍历变量
  visitVariableDeclaration(node) {
    let str = "";
    // node.kind 表示类型，比如var a = 1； node.kind = "var"
    str += node.kind + " ";
    str += this.visitNodes(node.declarations);
    return str + "\n";
  }

  visitNodes(nodes) {
    let str = "";
    for (const node of nodes) {
      str += this.visitNode(node);
    }
    return str;
  }
  visitVariableDeclarator(node, kind) {
    let str = "";
    str += kind ? kind + " " : str;
    str += this.visitNode(node.id);
    str += "=";
    str += this.visitNode(node.init);
    return str + ";" + "\n";
  }
  visitIdentifier(node) {
    return node.name;
  }
  visitLiteral(node) {
    return node.raw;
  }
  visitBinaryExpression(node) {
    let str = "";
    str += this.visitNode(node.left);
    str += node.operator;
    str += this.visitNode(node.right);
    return str + "\n";
  }
  visitFunctionDeclaration(node) {
    let str = "function ";
    str += this.visitNode(node.id);
    str += "(";
    for (let param = 0; param < node.params.length; param++) {
      str += this.visitNode(node.params[param]);
      str += node.params[param] == undefined ? "" : ",";
    }
    str = str.slice(0, str.length - 1);
    str += "){";
    str += this.visitNode(node.body);
    str += "}";
    return str + "\n";
  }
  visitBlockStatement(node) {
    let str = "";
    str += this.visitNodes(node.body);
    return str;
  }
  visitCallExpression(node) {
    let str = "";
    const callee = this.visitIdentifier(node.callee);
    str += callee + "(";
    for (const arg of node.arguments) {
      str += this.visitNode(arg) + ",";
    }
    str = str.slice(0, str.length - 1);
    str += ");";
    return str + "\n";
  }
  visitReturnStatement(node) {
    let str = "return ";
    str += this.visitNode(node.argument);
    return str + "\n";
  }
  visitExpressionStatement(node) {
    return this.visitNode(node.expression);
  }

  visitNode(node) {
    let str = "";
    switch (node.type) {
      case "VariableDeclaration":
        str += this.visitVariableDeclaration(node);
        break;
      case "VariableDeclarator":
        str += this.visitVariableDeclarator(node);
        break;
      case "Literal":
        str += this.visitLiteral(node);
        break;
      case "Identifier":
        str += this.visitIdentifier(node);
        break;
      case "BinaryExpression":
        str += this.visitBinaryExpression(node);
        break;
      case "FunctionDeclaration":
        str += this.visitFunctionDeclaration(node);
        break;
      case "BlockStatement":
        str += this.visitBlockStatement(node);
        break;
      case "CallExpression":
        str += this.visitCallExpression(node);
        break;
      case "ReturnStatement":
        str += this.visitReturnStatement(node);
        break;
      case "ExpressionStatement":
        str += this.visitExpressionStatement(node);
        break;
    }
    return str;
  }
  run(body) {
    let str = "";
    str += this.visitNodes(body);
    return str;
  }
}
module.exports = JSEmitter;
