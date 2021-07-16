import {
  ClientSideBaseVisitor,
  ClientSideBasePluginConfig,
  getConfigValue,
  LoadedFragment,
  DocumentMode,
} from '@graphql-codegen/visitor-plugin-common';
import { ReactApolloRawPluginConfig } from './config';
import autoBind from 'auto-bind';
import { OperationDefinitionNode, GraphQLSchema } from 'graphql';
import { Types } from '@graphql-codegen/plugin-helpers';
import { pascalCase } from 'change-case-all';

const APOLLO_CLIENT_3_UNIFIED_PACKAGE = '@apollo/client';
const GROUPED_APOLLO_CLIENT_3_IDENTIFIER = 'Apollo';

const reverseIf = (array, cond) => (cond ? array.reverse() : array);

export interface ReactApolloPluginConfig extends ClientSideBasePluginConfig {
  withCallFns: boolean;
  withHooks: boolean;
  withMutationFn: boolean;
  withRefetchFn: boolean;
  apolloReactCommonImportFrom: string;
  apolloReactComponentsImportFrom: string;
  apolloReactHocImportFrom: string;
  apolloReactHooksImportFrom: string;
  componentSuffix: string;
  reactApolloVersion: 2 | 3;
  withResultType: boolean;
  withMutationOptionsType: boolean;
  addDocBlocks: boolean;
  defaultBaseOptions: { [key: string]: string };
  hooksSuffix: string;
}

export class ReactApolloVisitor extends ClientSideBaseVisitor<
  ReactApolloRawPluginConfig,
  ReactApolloPluginConfig
> {
  private _externalImportPrefix: string;
  private imports = new Set<string>();

  constructor(
    schema: GraphQLSchema,
    fragments: LoadedFragment[],
    protected rawConfig: ReactApolloRawPluginConfig,
    documents: Types.DocumentFile[],
  ) {
    super(schema, fragments, rawConfig, {
      componentSuffix: getConfigValue(rawConfig.componentSuffix, 'Component'),
      withCallFns: getConfigValue(rawConfig.withCallFns, true),
      withMutationFn: getConfigValue(rawConfig.withMutationFn, true),
      withRefetchFn: getConfigValue(rawConfig.withRefetchFn, false),
      apolloReactCommonImportFrom: getConfigValue(
        rawConfig.apolloReactCommonImportFrom,
        rawConfig.reactApolloVersion === 2
          ? '@apollo/react-common'
          : APOLLO_CLIENT_3_UNIFIED_PACKAGE,
      ),
      apolloReactComponentsImportFrom: getConfigValue(
        rawConfig.apolloReactComponentsImportFrom,
        rawConfig.reactApolloVersion === 2
          ? '@apollo/react-components'
          : `${APOLLO_CLIENT_3_UNIFIED_PACKAGE}/react/components`,
      ),
      apolloReactHocImportFrom: getConfigValue(
        rawConfig.apolloReactHocImportFrom,
        rawConfig.reactApolloVersion === 2
          ? '@apollo/react-hoc'
          : `${APOLLO_CLIENT_3_UNIFIED_PACKAGE}/react/hoc`,
      ),
      apolloReactHooksImportFrom: getConfigValue(
        rawConfig.apolloReactHooksImportFrom,
        rawConfig.reactApolloVersion === 2
          ? '@apollo/react-hooks'
          : APOLLO_CLIENT_3_UNIFIED_PACKAGE,
      ),
      reactApolloVersion: getConfigValue(rawConfig.reactApolloVersion, 3),
      withResultType: getConfigValue(rawConfig.withResultType, true),
      withMutationOptionsType: getConfigValue(
        rawConfig.withMutationOptionsType,
        true,
      ),
      addDocBlocks: getConfigValue(rawConfig.addDocBlocks, true),
      defaultBaseOptions: getConfigValue(rawConfig.defaultBaseOptions, {}),
      gqlImport: getConfigValue(
        rawConfig.gqlImport,
        rawConfig.reactApolloVersion === 2
          ? undefined
          : `${APOLLO_CLIENT_3_UNIFIED_PACKAGE}#gql`,
      ),
      hooksSuffix: getConfigValue(rawConfig.hooksSuffix, ''),
    });

    this._externalImportPrefix = this.config.importOperationTypesFrom
      ? `${this.config.importOperationTypesFrom}.`
      : '';
    this._documents = documents;

    autoBind(this);
  }

  private getImportStatement(isTypeImport: boolean): string {
    return isTypeImport && this.config.useTypeImports
      ? 'import type'
      : 'import';
  }

  private getOperationTypeName(operation) {
    switch (operation) {
      case 'Query':
        return 'query';
      case 'Mutation':
        return 'mutate';
      case 'Subscription':
        return 'subscribe';
      default:
        return '';
    }
  }

  private getApolloReactCommonIdentifier(): string {
    if (
      this.rawConfig.apolloReactCommonImportFrom ||
      this.config.reactApolloVersion === 2
    ) {
      return 'ApolloReactCommon';
    }

    return GROUPED_APOLLO_CLIENT_3_IDENTIFIER;
  }

  private getApolloReactHooksIdentifier(): string {
    if (
      this.rawConfig.apolloReactHooksImportFrom ||
      this.config.reactApolloVersion === 2
    ) {
      return 'ApolloReactHooks';
    }

    return GROUPED_APOLLO_CLIENT_3_IDENTIFIER;
  }

  private usesExternalHooksOnly(): boolean {
    const apolloReactCommonIdentifier = this.getApolloReactCommonIdentifier();
    return (
      apolloReactCommonIdentifier === GROUPED_APOLLO_CLIENT_3_IDENTIFIER &&
      this.config.apolloReactHooksImportFrom !==
        APOLLO_CLIENT_3_UNIFIED_PACKAGE &&
      this.config.withCallFns
    );
  }

  private getApolloReactCommonImport(isTypeImport: boolean): string {
    const apolloReactCommonIdentifier = this.getApolloReactCommonIdentifier();

    return `${this.getImportStatement(
      isTypeImport &&
        (apolloReactCommonIdentifier !== GROUPED_APOLLO_CLIENT_3_IDENTIFIER ||
          this.usesExternalHooksOnly()),
    )} * as ${apolloReactCommonIdentifier} from '${
      this.config.apolloReactCommonImportFrom
    }';`;
  }

  private getApolloReactHooksImport(isTypeImport: boolean): string {
    return `${this.getImportStatement(
      isTypeImport,
    )} * as ${this.getApolloReactHooksIdentifier()} from '${
      this.config.apolloReactHooksImportFrom
    }';`;
  }

  private getDefaultOptions(): string {
    return `const defaultOptions =  ${JSON.stringify(
      this.config.defaultBaseOptions,
    )}`;
  }

  private getDocumentNodeVariable(
    node: OperationDefinitionNode,
    documentVariableName: string,
  ): string {
    return this.config.documentMode === DocumentMode.external
      ? `Operations.${node.name?.value ?? ''}`
      : documentVariableName;
  }

  public getImports(): string[] {
    const baseImports = super.getImports();
    const hasOperations = this._collectedOperations.length > 0;

    if (!hasOperations) {
      return baseImports;
    }

    return [...baseImports, ...Array.from(this.imports)];
  }

  private _buildMutationFn(
    node: OperationDefinitionNode,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string | null {
    if (node.operation === 'mutation') {
      this.imports.add(this.getApolloReactCommonImport(true));
      return `export type ${this.convertName(
        (node.name?.value ?? '') + 'MutationFn',
      )} = ${this.getApolloReactCommonIdentifier()}.MutationFunction<${operationResultType}, ${operationVariablesTypes}>;`;
    }
    return null;
  }

  private _buildCallJSDoc(
    node: OperationDefinitionNode,
    operationName: string,
    operationType: string,
  ): string {
    const variableString = node.variableDefinitions?.reduce((acc, item) => {
      const name = item.variable.name.value;

      return `${acc}\n *      ${name}: // value for '${name}'`;
    }, '');

    const queryDescription = `
 * To run a query call \`run${operationName}\` and pass it an apollo client and any options that fit your needs.
 * \`run${operationName}\` returns a promise, which either resolves to requested data, or throws an error.`;

    const queryExample = `
 * const { data } = await run${operationName}({
 *   variables: {${variableString}
 *   },
 * });`;

    const mutationDescription = `
 * To run a mutation call \`run${operationName}\` and pass it an apollo client and any options that fit your needs.
 * \`run${operationName}\` returns a promise, which either resolves to requested data, or throws an error.`;

    const mutationExample = `
 * const { data } = await run${operationName}({
 *   variables: {${variableString}
 *   },
 * });`;

    return `
/**
 * __run${operationName}__
 *${operationType === 'Mutation' ? mutationDescription : queryDescription}
 *
 * @param baseOptions options that will be passed into the ${operationType.toLowerCase()}, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#${
      operationType === 'Mutation' ? 'options-2' : 'options'
    };
 *
 * @example${operationType === 'Mutation' ? mutationExample : queryExample}
 */`;
  }

  private _buildFunctions(
    node: OperationDefinitionNode,
    operationType: string,
    documentVariableName: string,
    operationResultType: string,
    operationVariablesTypes: string,
    hasRequiredVariables: boolean,
  ): string {
    const nodeName = node.name?.value ?? '';
    const suffix = this._getFunctionSuffix(nodeName, operationType);
    const operationName: string =
      this.convertName(nodeName, {
        suffix,
        useTypesPrefix: false,
        useTypesSuffix: false,
      }) + this.config.hooksSuffix;

    this.imports.add(this.getApolloReactCommonImport(true));
    this.imports.add(this.getApolloReactHooksImport(false));
    this.imports.add(this.getDefaultOptions());

    const typedFns = [
      `
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
      export function run${operationName}<T>(
          client: ${this.getApolloReactHooksIdentifier()}.ApolloClient<T>,baseOptions${
        hasRequiredVariables && operationType !== 'Mutation' ? '' : '?'
      }: Omit<${this.getApolloReactHooksIdentifier()}.${operationType}Options<${reverseIf(
        [operationVariablesTypes, operationResultType],
        operationType === 'Mutation',
      ).join(',')}>, '${
        operationType === 'Mutation' ? 'mutation' : 'query'
      }'>) {
        const options = {...defaultOptions, ...baseOptions, ${
          operationType === 'Mutation' ? 'mutation' : 'query'
        } : ${this.getDocumentNodeVariable(node, documentVariableName)}}
        return client.${this.getOperationTypeName(
          operationType,
        )}<${operationResultType}, ${operationVariablesTypes}>(options);
      }`,
    ];

    if (this.config.addDocBlocks) {
      typedFns.unshift(
        this._buildCallJSDoc(node, operationName, operationType),
      );
    }

    const callResults = [
      `export type ${operationName}CallResult = ReturnType<typeof run${operationName}>;`,
    ];

    return [...typedFns, ...callResults].join('\n');
  }

  private _getFunctionSuffix(name: string, operationType: string) {
    if (this.config.omitOperationSuffix) {
      return '';
    }
    if (!this.config.dedupeOperationSuffix) {
      return pascalCase(operationType);
    }
    if (
      name.includes('Query') ||
      name.includes('Mutation') ||
      name.includes('Subscription')
    ) {
      return '';
    }
    return pascalCase(operationType);
  }

  private _buildResultType(
    node: OperationDefinitionNode,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string {
    const componentResultType = this.convertName(node.name?.value ?? '', {
      suffix: `${operationType}Result`,
      useTypesPrefix: false,
    });

    switch (node.operation) {
      case 'query':
        this.imports.add(this.getApolloReactCommonImport(true));
        return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.QueryResult<${operationResultType}, ${operationVariablesTypes}>;`;
      case 'mutation':
        this.imports.add(this.getApolloReactCommonImport(true));
        return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.MutationResult<${operationResultType}>;`;
      case 'subscription':
        this.imports.add(this.getApolloReactCommonImport(true));
        return `export type ${componentResultType} = ${this.getApolloReactCommonIdentifier()}.SubscriptionResult<${operationResultType}>;`;
      default:
        return '';
    }
  }

  private _buildWithMutationOptionsType(
    node: OperationDefinitionNode,
    operationResultType: string,
    operationVariablesTypes: string,
  ): string {
    if (node.operation !== 'mutation') {
      return '';
    }

    this.imports.add(this.getApolloReactCommonImport(true));

    const mutationOptionsType = this.convertName(node.name?.value ?? '', {
      suffix: 'MutationOptions',
      useTypesPrefix: false,
    });

    return `export type ${mutationOptionsType} = ${this.getApolloReactCommonIdentifier()}.BaseMutationOptions<${operationResultType}, ${operationVariablesTypes}>;`;
  }

  private _buildRefetchFn(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationVariablesTypes: string,
  ): string {
    if (node.operation !== 'query') {
      return '';
    }

    const nodeName = node.name?.value ?? '';
    const operationName: string =
      this.convertName(nodeName, {
        suffix: this._getFunctionSuffix(nodeName, operationType),
        useTypesPrefix: false,
      }) + this.config.hooksSuffix;

    return `export function refetch${operationName}(variables?: ${operationVariablesTypes}) {
      return { query: ${this.getDocumentNodeVariable(
        node,
        documentVariableName,
      )}, variables: variables }
    }`;
  }

  protected buildOperation(
    node: OperationDefinitionNode,
    documentVariableName: string,
    operationType: string,
    operationResultType: string,
    operationVariablesTypes: string,
    hasRequiredVariables: boolean,
  ): string {
    operationResultType = this._externalImportPrefix + operationResultType;
    operationVariablesTypes =
      this._externalImportPrefix + operationVariablesTypes;

    const mutationFn = this.config.withMutationFn
      ? this._buildMutationFn(
          node,
          operationResultType,
          operationVariablesTypes,
        )
      : null;
    const callFunctions = this.config.withCallFns
      ? this._buildFunctions(
          node,
          operationType,
          documentVariableName,
          operationResultType,
          operationVariablesTypes,
          hasRequiredVariables,
        )
      : null;
    const resultType = this.config.withResultType
      ? this._buildResultType(
          node,
          operationType,
          operationResultType,
          operationVariablesTypes,
        )
      : null;
    const mutationOptionsType = this.config.withMutationOptionsType
      ? this._buildWithMutationOptionsType(
          node,
          operationResultType,
          operationVariablesTypes,
        )
      : null;
    const refetchFn = this.config.withRefetchFn
      ? this._buildRefetchFn(
          node,
          documentVariableName,
          operationType,
          operationVariablesTypes,
        )
      : null;

    return [
      mutationFn,
      callFunctions,
      resultType,
      mutationOptionsType,
      refetchFn,
    ]
      .filter(a => a)
      .join('\n');
  }
}
