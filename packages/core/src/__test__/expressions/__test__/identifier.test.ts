import { describe, expect, it } from 'vitest';

import * as ast from '../../../ast';
import { NearleyError, Parser } from '../../../parser';
import * as utils from '../../utils';
import { identifierTemplates } from '..';

describe('valid', () => {
  it('no arguments', () => {
    identifierTemplates.forEach(template => {
      utils.createSource({
        content: `type ${template} = any`,
        nodes: [
          utils.createNode({
            instance: ast.TypeAliasStatement,
            name: utils.createNode({
              instance: ast.IdentifierExpression,
              outputStr: template
            })
          })
        ]
      });
    });
  });

  it('has arguments', () => {});
});

it('invalid', () => {
  const templates = [
    '1name',
    '-f123',
    '#df',
    '1',
    '1.1',
    '1.1.1',
    '*sdfsdf',
    'sdfsdf*',
    "sdf'",
    'jjjsdf;',
    'sdf,',
    'sdf.',
    'sdf?'
  ];

  it('error throw: UnexpectedInput', () => {
    for (const id of templates) {
      const fn = () => new Parser().parse(`type ${id} = 1`);

      expect(fn).throw();

      try {
        fn();
      } catch (error) {
        expect(error).instanceOf(NearleyError.UnexpectedInput);
      }
    }
  });
});
