import {
  Types,
  PluginValidateFn,
  PluginFunction,
} from '@graphql-codegen/plugin-helpers';
import {
  visit,
  GraphQLSchema,
  concatAST,
  Kind,
  FragmentDefinitionNode,
} from 'graphql';
import { LoadedFragment } from '@graphql-codegen/visitor-plugin-common';
import { ReactApolloVisitor } from './visitor';
import { extname } from 'path';
import { ReactApolloRawPluginConfig } from './config';

export const plugin: PluginFunction<
  ReactApolloRawPluginConfig,
  Types.ComplexPluginOutput
> = (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactApolloRawPluginConfig,
) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const allAst = concatAST(documents.map(v => v.document!));

  const allFragments: LoadedFragment[] = [
    ...(
      allAst.definitions.filter(
        d => d.kind === Kind.FRAGMENT_DEFINITION,
      ) as FragmentDefinitionNode[]
    ).map(fragmentDef => ({
      node: fragmentDef,
      name: fragmentDef.name.value,
      onType: fragmentDef.typeCondition.name.value,
      isExternal: false,
    })),
    ...(config.externalFragments || []),
  ];

  const visitor = new ReactApolloVisitor(
    schema,
    allFragments,
    config,
    documents,
  );
  const visitorResult = visit(allAst, { leave: visitor });

  return {
    prepend: visitor.getImports(),
    content: [
      visitor.fragments,
      ...visitorResult.definitions.filter(
        (t: unknown) => typeof t === 'string',
      ),
    ].join('\n'),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const validate: PluginValidateFn<any> = async (
  schema: GraphQLSchema,
  documents: Types.DocumentFile[],
  config: ReactApolloRawPluginConfig,
  outputFile: string,
) => {
  if (extname(outputFile) !== '.ts' && extname(outputFile) !== '.tsx') {
    throw new Error(
      'Plugin "typescript-react-apollo" requires extension to be ".ts" or ".tsx"!',
    );
  }
};

export { ReactApolloVisitor };
