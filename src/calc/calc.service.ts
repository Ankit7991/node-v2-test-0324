import { Injectable } from '@nestjs/common';
import { CalcDto } from './calc.dto';

type operations = '/' | '*' | '+' | '-';
interface ICalculationOut {
  exp: string;
  isNegative: boolean;
}

@Injectable()
export class CalcService {
  // operation lists with specific order of operation
  private operation: operations[] = ['/', '*', '+', '-'];
  // replace text function
  private replace(
    into: string,
    at: number,
    value: string,
    replaceWith: string,
  ) {
    // console.log(`^^`, into, at, value, repl	aceWith);
    return (
      into.substring(0, at) + replaceWith + into.substring(at + value.length)
    );
  }

  // calculation based of different operations
  private operationExecution(
    expression: ICalculationOut,
    op: operations,
  ): ICalculationOut {
    const regex = new RegExp(`(\\d+)\\${op}(\\d+)`);
    if (expression.exp.startsWith('-') && !expression.isNegative) {
      expression.isNegative = true;
      return expression;
    }
    // console.log(regex);
    const match = expression.exp.match(regex);
    // const match = expression.exp.match(/(\d+)\/(\d+)/);
    let output = expression;
    const a = parseInt(match[1]),
      b = parseInt(match[2]);
    // console.log('$$1', output, `---`, a, op, b);
    const out =
      op === '/'
        ? a / b
        : op === '*'
        ? a * b
        : op === '+'
        ? a + b
        : op === '-'
        ? a - b
        : null;
    if (out === null || !match)
      throw new TypeError('Invalid expression provided');
    expression.exp = this.replace(
      expression.exp,
      match.index,
      match[0],
      out.toString(),
    );
    // this['/']
    // console.log('$$2', output, out, match);

    // Recursively execute all the operations for each type of calculation
    if (expression.exp.includes(op))
      output = this.operationExecution(expression, op);
    // console.log(`$$`, output);
    return output;
  }

  calculateExpression(calcBody: CalcDto) {
    try {
      const exp = { exp: calcBody.expression, isNegative: false }; // We'll pass this by reference
      exp.exp.split(/[\+\-*\/]/g).map((el) => {
        if (el === '') throw new TypeError('Invalid expression provided');
      });
      const givenOperations = this.operation.filter((el) =>
        exp.exp.includes(el),
      );
      // console.log({givenOperations});

      // loop over given operations
      givenOperations.map((op) => {
        this.operationExecution(exp, op);
      });

      return parseInt(`${exp.exp}`);
    } catch (error) {
      throw new TypeError('Invalid expression provided');
    }
  }
}
