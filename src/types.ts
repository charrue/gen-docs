type MetaSchema = {
  code: {
    funcscope: string;
    id: string;
    name: string;
    node: Record<string, any>;
    paramnames: string[];
    type: string;
    value: string;
  };
  filename: string;
  columnno: number;
  lineno: number;
  path: string;
  range: [number, number];
  vars: Record<string, any>;
};

type TypePropertySchema = {
  names: string[];
  parsedType: Record<string, any>;
};
export type ParamSchema = {
  defaktvalue: string;
  description: string;
  name: string;
  nullable: boolean | null;
  optional: string;
  type: TypePropertySchema;
  variable: boolean | null;
};

type EnumPropertySchema = {
  comment: string;
  defaultvalue: string;
  description: string;
  kind: "member";
  longname: string;
  memberof: string;
  meta: MetaSchema;
  nullable: boolean | null;
  scope: "static";
  type: TypePropertySchema;
  variable: boolean | null;
};

type TagSchema = {
  originTitle: string;
  text: string;
  title: string;
  value: string;
};

type Kind =
  | "class"
  | "constant"
  | "event"
  | "external"
  | "file"
  | "function"
  | "interface"
  | "member"
  | "mixin"
  | "module"
  | "namespace"
  | "package"
  | "param"
  | "typedef";

export type JsDocSchema = Partial<{
  access: "package" | "private" | "protected" | "public";
  alias: string;
  async: boolean;
  arguments: string[];
  author: string[];
  borrowed: { as: string; from: string }[];
  classdesc: string;
  comment: string;
  copyright: string;
  defaultvalue: string;
  defaultvaluetype: "object" | "array";
  description: string;
  deprecated: boolean;
  examples: string[];
  exceptions: ParamSchema[];
  extends: string[];
  ignore: boolean;
  meta: MetaSchema;
  kind: Kind;
  name: string;
  longname: string;
  memberof: string;
  params: ParamSchema[];
  properties: (EnumPropertySchema | TypePropertySchema)[];
  readonly: boolean;
  requires: string[];
  returns: ParamSchema[];
  scope: "global" | "inner" | "instance" | "static";
  see: string;
  since: string;
  summary: string;
  tags: TagSchema[];
  this: string;
  todo: string[];
  type: TypePropertySchema;
  undocumented: boolean;
  variable: boolean | null;
  variation: string;
  version: string;
  virtual: boolean;
  yields: ParamSchema[];
}>;

export type TemplateContext = Omit<JsDocSchema, "params" | "returns" | "examples"> & {
  params: (Omit<ParamSchema, "type"> & { type: string })[];
  returns: {
    type: string;
    description: string;
  };
  examples: string;
}
