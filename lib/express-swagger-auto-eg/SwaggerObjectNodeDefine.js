/**
 * Created by eagleQL on 4/8 2020.
 */
class SwaggerObjectNodeDefine {
    static requireStaticDefinedObjects() {
        return require('./definitions')
    }
}

class SwaggerObjectNodeSchemaAttribute {
    type = 'string'
    comment = '-'
    description = this.comment
    require = false
    example = 'some value'

    /**
     *
     * @param {string} type
     * @param {string} comment
     * @param {boolean} [require]
     * @param {*} [eg]
     */
    constructor(type, comment, require, eg) {
        this.type = type || this.type
        this.description = this.comment = comment || this.comment
        this.require = require || this.require
        this.example = eg !== undefined ? eg : this.example
    }

}

class SwaggerObjectNodeRef {
    $ref

    /**
     *
     * @param {string} $ref - eg: '#/definitions/列表-数据节点'
     */
    constructor($ref) {
        this.$ref = $ref || this.$ref
    }
}

class SwaggerObjectNode {
    $name = 'default swagger type node'
    schema = {}
    description = this.$name

    /**
     *
     * @param {string} $name
     * @param {SwaggerObjectNodeSchemaAttribute|SwaggerObjectNodeRef} schema
     * @param {string} description
     */
    constructor($name, schema, description) {
        this.$name = $name || 'unnamed swagger type node'
        this.schema = schema || {}
        this.description = description || this.$name
    }

    /**
     *
     * @param nodeName
     * @return {SwaggerObjectNode}
     */
    getSchemaNodeOrAttribute(nodeName) {
        return this.schema[nodeName]
    }
}

class SwaggerRequestBodyNode extends SwaggerObjectNode {
    name = '请求体'
    $in = 'body' // option: query
    required = false
    type = 'object' // option: enum
    $enum = []

    /**
     *
     * @param {string} name
     * @param {string} $in
     * @param {SwaggerObjectNodeSchemaAttribute|SwaggerObjectNodeRef} schema
     * @param {boolean} required
     * @param {string} [description]
     * @param {string} [type]
     * @param {[*]} [$enum]
     */
    constructor(name, $in, schema, required, description, type, $enum) {
        super(name, schema, description);
        this.$in = $in || this.$in
        this.required = required
        this.in = this.$in
        this.type = type
        this.enum = this.$enum = $enum || []
    }

}

module.exports = {
    SwaggerObjectNodeDefine, SwaggerObjectNode, SwaggerObjectNodeSchemaAttribute,
    SwaggerObjectNodeRef, SwaggerRequestBodyNode
}