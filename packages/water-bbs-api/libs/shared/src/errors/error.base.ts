import { HttpStatus } from '@nestjs/common';
import { I18nPath } from '../.generated/i18n.generated';
import { ApiProperty } from '@nestjs/swagger';
export type ErrorProps = {
  key: I18nPath;
  status: HttpStatus;
  args?: Record<string, any>;
  details?: Record<string, any>;
  cause?: Error;
};

export class HttpPresentationError {
  @ApiProperty({ description: '错误 message', example: '错误信息' })
  public readonly message: string;
  @ApiProperty({ description: '错误状态码', example: HttpStatus.BAD_REQUEST })
  public readonly statusCode: number;
  @ApiProperty({ description: '错误详情', example: { id: 123456 } })
  public readonly details: Record<string, any>;
  constructor(
    message: string,
    statusCode: number,
    details: Record<string, any> = {},
  ) {
    this.message = message;
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class DomainError extends Error {
  public readonly key: I18nPath;
  public readonly status: HttpStatus;
  public readonly args?: Record<string, any>;
  public readonly details?: Record<string, any>;
  public readonly cause?: Error;
  constructor(props: ErrorProps) {
    super(props.key, { cause: props.cause });
    this.key = props.key;
    this.status = props.status;
    this.args = props.args;
    this.details = props.details;
    this.cause = props.cause;
  }
  toHttpPresentationError(): HttpPresentationError {
    return new HttpPresentationError(this.message, this.status, this.details);
  }
}

export class InfraError extends Error {
  public readonly key: I18nPath;
  public readonly status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  public readonly args?: Record<string, any>;
  public readonly details?: Record<string, any>;
  public readonly cause?: Error;
  constructor(props: Omit<ErrorProps, 'status'> & { status?: HttpStatus }) {
    super(props.key, { cause: props.cause });
    this.key = props.key;
    this.status = props.status || HttpStatus.INTERNAL_SERVER_ERROR;
    this.args = props.args;
    this.details = props.details;
    this.cause = props.cause;
  }
  toHttpPresentationError(): HttpPresentationError {
    return new HttpPresentationError(this.message, this.status, this.details);
  }
}