import { err, ok } from 'neverthrow';
import { SchemaParseError, SchemaTypeError } from '../../errors';
import ajv from 'ajv';
import { JSONContent } from '@tiptap/core';

export const jsonSchema = {
  // $schema: 'https://json-schema.org/draft/2020-12/schema',
  $ref: '#/$defs/docNode',
  $defs: {
    docNode: {
      type: 'object',
      required: ['type', 'content'],
      properties: {
        type: { const: 'doc' },
        attrs: { type: 'object' },
        content: {
          type: 'array',
          items: { $ref: '#/$defs/node' },
        },
      },
      additionalProperties: false,
    },
    node: {
      type: 'object',
      required: ['type'],
      properties: {
        type: { type: 'string' },
        attrs: { type: 'object' },
        content: {
          type: 'array',
          items: { $ref: '#/$defs/node' },
        },
        marks: {
          type: 'array',
          items: { $ref: '#/$defs/mark' },
        },
        text: { type: 'string' },
      },
      allOf: [
        {
          if: { properties: { type: { const: 'text' } } },
          then: {
            required: ['text'],
            not: { required: ['content'] },
          },
          else: {
            not: { required: ['text'] },
          },
        },
      ],
      additionalProperties: false,
    },
    mark: {
      type: 'object',
      required: ['type'],
      properties: {
        type: { type: 'string' },
        attrs: { type: 'object' },
      },
      additionalProperties: false,
    },
  },
};

const f = new ajv().compile<JSONContent>(jsonSchema);

export const validate = (val: unknown) => {
  if (typeof val !== 'object') {
    return err(new SchemaTypeError('object', typeof val));
  }
  const result = f(val);
  if (!result) {
    return err(new SchemaParseError());
  }
  return ok(val);
};
