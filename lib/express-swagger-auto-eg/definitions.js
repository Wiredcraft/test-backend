/**
 * Created by eagleQL on 4/8 2020.
 */
const {SwaggerObjectNode, SwaggerObjectNodeSchemaAttribute, SwaggerObjectNodeRef, SwaggerRequestBodyNode} = require('./SwaggerObjectNodeDefine')
const definitions = {
    responseListDate: new SwaggerObjectNode('列表-数据节点', {
        list: new SwaggerObjectNodeSchemaAttribute('array', '数据列表', false, [{},{}])
    }),
    responseListParams: new SwaggerObjectNode('列表-请求时的分页参数', {
        begin: new SwaggerObjectNodeSchemaAttribute('number', '当前页数（从 0 开始）', true, 0),
        count: new SwaggerObjectNodeSchemaAttribute('number', '每页条数', true, 10),
        total: new SwaggerObjectNodeSchemaAttribute('number', '总条数', true, 99999),
    }),
    responseList200: new SwaggerObjectNode('列表-请求成功', {
        code: new SwaggerObjectNodeSchemaAttribute('number', '状态码：0 成功，1 失败', true, 0),
        message: new SwaggerObjectNodeSchemaAttribute('string', '状态|失败原因', true, 'success'),
        params: new SwaggerObjectNodeRef('#/definitions/列表-请求时的分页参数'),
        data: new SwaggerObjectNodeRef('#/definitions/列表-数据节点'),

    }),
    responseList: new SwaggerObjectNode('响应体', {
        ['200']: new SwaggerObjectNodeRef('#/definitions/列表-请求成功'),

    }),
    requestListBodyParams: new SwaggerObjectNode('列表请求-分页及筛选参数', {
        begin: new SwaggerObjectNodeSchemaAttribute('number', '页数(以 0 开始)', true, 0),
        count: new SwaggerObjectNodeSchemaAttribute('number', '每页条数', true, 3),
        filters: new SwaggerObjectNodeSchemaAttribute('array', '筛选条件', false, [{key: 'id', exp: '>', value: 0}]),
    }),
    requestListBodyNode: new SwaggerRequestBodyNode('列表请求-请求体', 'body', new SwaggerObjectNodeRef('#/definitions/列表请求-分页及筛选参数'), true, '在 body 中提交分页及筛选参数'),

    requestViewBodyParams: new SwaggerObjectNode('详情请求-id', {
        id: new SwaggerObjectNodeSchemaAttribute('number', '数据 id', true, 1),
    }),
    requestViewBodyNode: new SwaggerRequestBodyNode('详情请求-请求体', 'body', new SwaggerObjectNodeRef('#/definitions/详情请求-id'), true, '在 body 中提交 id'),

    requestCreateBodyParams: new SwaggerObjectNode('创建请求-json数据包', {
    }),
    requestCreateBodyNode: new SwaggerRequestBodyNode('创建请求-请求体', 'body', new SwaggerObjectNodeRef('#/definitions/创建请求-json数据包'), true, '在 body 中提交 json 数据包'),

    requestUpdateBodyParams: new SwaggerObjectNode('更新请求-json数据包', {
        id: new SwaggerObjectNodeSchemaAttribute('number', '需要修改的记录的 id', true, 1),
    }),
    requestUpdateBodyNode: new SwaggerRequestBodyNode('更新请求-请求体', 'body', new SwaggerObjectNodeRef('#/definitions/更新请求-json数据包'), true, '在 body 中提交 json 数据包'),

    requestDestroyBodyParams: new SwaggerObjectNode('删除请求-ids', {
        ids: new SwaggerObjectNodeSchemaAttribute('array', '需要删除的 ids', true, [999999, 999999998]),
    }),
    requestDestroyBodyNode: new SwaggerRequestBodyNode('删除请求-请求体', 'body', new SwaggerObjectNodeRef('#/definitions/删除请求-ids'), true, '在 body 中提交需要删除的 ids（数组）'),



}

module.exports = definitions
