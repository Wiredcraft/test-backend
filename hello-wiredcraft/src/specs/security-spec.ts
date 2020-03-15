import {ReferenceObject, SecuritySchemeObject} from '@loopback/openapi-v3';
export const OPERATION_SECURITY_SPEC = [{bearerAuth: []}];
export type SecuritySchemeObjects = {
  [SecurityScheme: string]: SecuritySchemeObject | ReferenceObject;
};
export const SECURITY_SCHEMA_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT',
  },
};
