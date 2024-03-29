import { Body, Controller, Post, Res } from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcDto } from './calc.dto';
import { Response } from 'express';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Post('/')
  calc(@Body() calcBody: CalcDto, @Res() res: Response) {
    try {
      const result = this.calcService.calculateExpression(calcBody);

      res.status(201).json({
        result,
      });
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: error.message,
        error: 'Bad Request',
      });
    }
  }
}
