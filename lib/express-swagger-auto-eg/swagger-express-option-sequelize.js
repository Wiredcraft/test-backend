/**
 * Created by eagleQL on 4/8 2020.
 */
/** @module index */
'use strict';

// Dependencies
const glob = require('glob');
const path = require('path');
const parser = require('swagger-parser');
const swaggerHelpers = require('./swagger-helpers');
//const swaggerUi = require('swagger-ui-express');
const swaggerUi = require('express-swaggerize-ui');
const {SwaggerObjectNodeDefine, SwaggerObjectNode, SwaggerObjectNodeSchemaAttribute, SwaggerObjectNodeRef, SwaggerRequestBodyNode} = require('./SwaggerObjectNodeDefine')
const staticDefinedObjects = SwaggerObjectNodeDefine.requireStaticDefinedObjects()
const routesDocRules = require('./routes-doc-definitions');
const lodash =require('lodash')
const logger =require('../logger')

function routerFormat(router, staticDefinenations, sequelize) {
    let currentModel
    if (sequelize) {
        try {
            currentModel = require(sequelize.modelPath + router.name)
        } catch (e) {
            logger.warn('swagger-express-option-sequelize 未找到模型 - ' + sequelize.modelPath + router.name)
        }

    }

    let route, parameters = {}, params = [], tags = [], definitions = {}
    const desc = router.name + '表'
    if (router && router.router && router.router.stack) {
        for (const api of router.router.stack) {
            if (!api.route) continue
            const currentMethods = Object.keys(api.route.methods).filter(k => api.route.methods[k] === true)
            for (const currentMethod of currentMethods) {
                const tableComment = currentModel ? `${currentModel.options.comment && currentModel.options.comment.replace('表', '')}` : ''
                const tagName = (router.name && router.name.trim() || '') + (tableComment ? `[${tableComment}]` : '')
                let uri = `/${router.name.toLowerCase()}${api.route.path.toLowerCase()}`
                uri = uri.replace(':id', '{id}')


                // 注册当前数据模型到 swagger-type
                if (currentModel) {
                    currentModel = lodash.cloneDeep(currentModel)
                    Object.entries(currentModel.fieldRawAttributesMap).forEach(([k, v]) => {
                        v.type = typeof v.type === 'string' ? v.type :  v.type.__proto__.constructor.name.toLowerCase()
                        v.description = v.comment
                    })
                    definitions[currentModel.name || currentModel.tableName] = {
                        required: ['id'],
                        properties: currentModel.fieldRawAttributesMap
                    }
                }

                const currentDocRule = routesDocRules.defaultAPIs[`${currentMethod}:${api.route.path.toLowerCase()}`]
                // 目前仅生成框架及的默认接口，自定义接口在对应的 router 中写 jsdoc 文档即可
                if (currentDocRule && currentModel) {
                    const currentOption = currentDocRule.desc || api.route.path.toLowerCase()

                    parameters[uri] = parameters[uri] || {}
                    parameters[uri][currentMethod] = parameters[uri][currentMethod] || {}
                    parameters[uri][currentMethod]['parameters'] = [
                        ['requestCreateBodyNode', 'requestUpdateBodyNode'].includes(currentDocRule.request) ?
                        staticDefinedObjects[currentDocRule.request].setSchema(new SwaggerObjectNodeRef(`#/definitions/${currentModel.name || currentModel.tableName}`))
                        : staticDefinedObjects[currentDocRule.request]
                    ]
                    parameters[uri][currentMethod]['description'] = tableComment + '-' + currentOption
                    parameters[uri][currentMethod]['tags'] = [tagName]
                    parameters[uri][currentMethod]['responses'] = parameters[uri][currentMethod]['responses'] || {}

                    let currentNode = staticDefinedObjects[currentDocRule.response].getSchemaNodeOrAttribute('200')
                    if (currentNode instanceof SwaggerObjectNodeRef) {
                        currentNode = staticDefinenations[currentNode.$ref.split('/')[currentNode.$ref.split('/').length - 1]].swaggerObjectNode
                    }
                    parameters[uri][currentMethod]['responses']['200'] =
                        {
                            description: currentNode.$name,
                            headers: currentNode.schema['headers'] || {},
                            schema: {$ref: "#/definitions/" + currentNode.$name}
                        }
                    tags.push({
                        name: tagName,
                        description: (router.name && router.name.trim() || '') + '表'
                    })

                    parameters[uri][currentMethod]['operationId'] = tableComment + '-' + currentOption
                    parameters[uri][currentMethod]['summary'] = tableComment + '-' + currentOption
                    parameters[uri][currentMethod]['produces'] = ['application/json', ' application/xml']
                    parameters[uri][currentMethod]['consumes'] = ['application/json', ' application/xml']
                    parameters[uri][currentMethod]['security'] = [{JWT: []}]
                    // parameters[route.uri][route.method]['deprecated']
                }


            }
        }
    }

    return {parameters: parameters, tags: tags, definitions: definitions}
}


/**
 * Converts an array of globs to full paths
 * @function
 * @param {array} globs - Array of globs and/or normal paths
 * @return {array} Array of fully-qualified paths
 * @requires glob
 */
function convertGlobPaths(base, globs) {
    return globs.reduce(function (acc, globString) {
        let globFiles = glob.sync(path.resolve(base, globString));
        return acc.concat(globFiles);
    }, []);
}

/**
 * Generates the swagger spec
 * @function
 * @param {object} options - Configuration options
 * @returns {array} Swagger spec
 * @requires swagger-parser
 */
function generateSpecAndMount(app) {

    return function (options) {
        /* istanbul ignore if */
        if (!options) {
            throw new Error('\'options\' is required.');
        } else /* istanbul ignore if */ if (!options.swaggerDefinition) {
            throw new Error('\'swaggerDefinition\' is required.');
        } else /* istanbul ignore if */ if (!options.files) {
            throw new Error('\'files\' is required.');
        }

        // Build basic swagger json
        let swaggerObject = swaggerHelpers.swaggerizeObj(options.swaggerDefinition);
        let apiFiles = convertGlobPaths(options.basedir, options.files);
        let apiRouters
        if (options.apiFetch && typeof options.apiFetch === "function") {
            apiRouters = options.apiFetch.call(this)
        }

        // 根据声明的文档节点对象类型 和 sequelize-model 生成文档
        // 注册声明的文档节点对象类型
        const staticDefinenations = {}
        const formatDefinenation = (obj) => {
            if (obj instanceof SwaggerObjectNode) {

                staticDefinenations[obj.$name] = {
                    required: Object.entries(obj.schema).map(([ak, av]) => {
                        if (av instanceof SwaggerObjectNodeSchemaAttribute && av.require) return ak
                        else formatDefinenation(av)
                    }).filter(k => k),
                    properties: obj.schema,
                    swaggerObjectNode: obj
                }
            }
        }
        Object.entries(staticDefinedObjects).forEach(([k, v]) => {
            formatDefinenation(v)
        })
        apiRouters.forEach(router => {
            try {
                const parsed = routerFormat(router, staticDefinenations, options.sequelize)
                swaggerHelpers.addDataToSwaggerObject(swaggerObject, [{
                    paths: parsed.parameters,
                    tags: parsed.tags,
                    definitions: {...staticDefinenations, ...parsed.definitions}
                }]);
            } catch (e) {
                console.log(`Incorrect comment format. Method was not documented.\nRouter: ${router.name}\nComment:`)
            }
        })

        parser.parse(swaggerObject, function (err, api) {
            if (!err) {
                swaggerObject = api;
            }
        });

        let url = options.route ? options.route.url : '/api-docs'
        let docs = options.route ? options.route.docs : '/api-docs.json'

        app.use(docs, function (req, res) {
            res.json(swaggerObject);
        });
        app.use(url, swaggerUi({
            route: url,
            docs: docs
        }));
        return swaggerObject;
    }
};


module.exports = {
    generateSpecAndMount,
};
