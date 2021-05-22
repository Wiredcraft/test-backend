const {Repo, BaseModel} = require('../orm/BaseRepository')
const {Op} = require('sequelize')
const logger = require('../lib/logger')

const OPERATORS = {
    'is': Op.is,
    'not': Op.not,
    '=': Op.eq,
    '>=': Op.gte,
    '>': Op.gt,
    '<=': Op.lte,
    '<': Op.lt,
    '!=': Op.ne,
    'like': Op.like,
    'notLike': Op.notLike,
    'iLike': Op.iLike,
    'notILike': Op.notILike,
    'in': Op.in,
    'notIn': Op.notIn,
    'between': Op.between,
    'notBetween': Op.notBetween,
    'iRegexp': Op.iRegexp,
    'notIRegexp': Op.notIRegexp,
}

function getOp(key) {
    return OPERATORS[key] ? OPERATORS[key] : null
}


/**
 * TASK 后期需要支持嵌套子句
 * 根据 api 请求数据中的 filters 中的元素 生成 where 子句
 * @param {{key: key, exp: exp, value: value, subConditions: filter}} filter
 * @return {Object}
 */
function generateWhereCondition({key, exp, value, subConditions = []}) {
    if (exp === 'in' && isNaN(value) && value.indexOf('(') === 0) {
        value = value.replace('(', '').replace(')', '').split(',')
    }
    if (['and', 'or'].includes(exp) && subConditions.length) {
        return {[Op[exp]]: getWhere_Condition_ByPostedRawFilters(subConditions)}
    }
    return getOp(exp) ? {[key]: {[getOp(exp)]: value}} : {}
}

/*
* 根据 api 请求数据中的 filters 生成 where 子句
* 接口查询表达式语法：    {
*   begin: 0,
*   count: 99999999,
*   filters: [{key: key, exp: exp, value: value},{...},...]
* }
* */
function getWhere_Condition_ByPostedRawFilters(filters = [], config) {
    let andCondition = []

    for (let i = 0; i < filters.length; ++i) {
        let filter = filters[i]
        if ((!filter.key && !['and', 'or'].includes(filter.exp)) || filter.exp === 'order') {
            continue
        }
        andCondition.push(generateWhereCondition(filter))
    }

    return andCondition

}

/**
 * 合并默认 where 条件、接口请求条件、方法传入条件
 * @param filters
 * @param {{topConditionLogic: Op, conditions: {}}} conditions
 * @param model
 * @return {*}
 */
function getDefaultWhereClauseByPostedRawFilters(filters = [], conditions = {
    topConditionLogic: Op.and,
    conditions: {}
}, model) {
    const conditionOfRawFilters = getWhere_Condition_ByPostedRawFilters(filters, model)
    return {
        where: {
            [conditions.topConditionLogic]: [
                {
                    [Op.and]: [
                        ...conditionOfRawFilters
                    ],
                },
                {
                    [Op.and]: [
                        {...conditions.conditions}
                    ]
                }
            ]

        }
    }

}

/**
 * 生成排序子句
 * @param request
 * @param filters
 * @param preOrders
 * @return {*}
 */
function getOderQueryClause(request, filters = [], preOrders = []) {
    let orders = (request.body && request.body.orders) || []
    orders = orders.concat(filters.filter(filter => filter.exp === 'order').map(filter => filter.key && filter.key.split('.').concat(filter.value))).concat(preOrders)
    return orders.length ? {order: orders} : {};
}

/**
 * 生成分页子句
 * @param request
 * @return {*}
 */
function getPageQueryClause(request) {
    let begin = +request.body.begin
    let count = +request.body.count
    begin = begin === -1 ? 0 : begin
    return count === -1 ? {} : isNaN(begin) || isNaN(count) ? {} : {limit: count, offset: begin};
}


function getDefaultSelecteFields(subQuery) {
    return {
        attributes: {
            // include: !subQuery ? [['Id', 'Id']] : [], // 如果没有子查询，则不怕子查询结果中会出现两个 id 而导致报错,
            include: !subQuery ? [] : [], // 如果没有子查询，则不怕子查询结果中会出现两个 id 而导致报错,
            exclude: []
        }
    };
}

/**
 * TASK
 * @param request
 * @return {{attributes: {include: [string[]]}}}
 */
function getSelectFields(request, subQuery) {
    return getDefaultSelecteFields(subQuery);
}

/**
 * 生成 include 配置
 * @param relationShip
 * @param targetModel
 * @param CI
 * @param rightJoin 和 innerJoin 互斥
 * @param innerJoin
 * @return {*}
 */
function getIncludeOptions(relationShip, targetModel, CI, rightJoin = false, innerJoin = false) {
    const fields = getDefaultSelecteFields();
    let includeOptions = {
        model: targetModel, ...fields,
        right: rightJoin,
        required: innerJoin
    }
    if (relationShip.options) {
        if (relationShip.options.as) {
            includeOptions.as = relationShip.options.as
        }
        if (relationShip.options.orders) {
            includeOptions.separate = true
            includeOptions.order = relationShip.options.orders
        }
    }

    return includeOptions
}

/**
 * 构建表关联关系
 * @param relationShip
 * @param config
 * @param repo
 * @param CI
 * @return {*}
 */
function buildRelationShip(relationShip = [], config, repo, CI) {
    const relationShipModel = relationShip.map(r => {

        // const modelOptions = r.alias ? {associations: [r.alias]} : {}
        // if(r.alias) {
        //     repo = new BaseRepository(config.tableName, modelOptions).model
        // }

        let sourceModel = config.tableName === r.sourceTable ? repo : new Repo(r.sourceTable).model
        let targetModel = config.tableName === r.targetTable ? repo : r.targetTable === r.sourceTable ? sourceModel : new Repo(r.targetTable).model

        // TASK 如果是表内自关联数据的话(无论是查找父行还是子行)，belongsto 需要指定 as 别名(无需去掉 belongsto 句子)，
        //  如 Taski.belongsTo(Taski, {foreignKey: 'LinkId', as: 'Parent'})
        //         Taski.hasMany(Taski, {foreignKey: 'LinkId', as: 'SubTasks'})
        //         const currentTask = await Taski.findOne({
        //             where: {
        //                 id: operationRow.id
        //             },
        //             include: [Team, {model:Taski, as: 'Parent'}, {model:Taski, as: 'SubTasks'}]
        //         })
        if (r.sourceTable !== r.targetTable) sourceModel.belongsTo(targetModel, r.options)
        if (r.schedule === 'one') {
            targetModel.hasOne(sourceModel, r.options)
        } else if (r.schedule === 'many') {
            targetModel.hasMany(sourceModel, r.options)
        } else {
            throw new Error('请指定映射模式')
        }
        // 反向映射时（主表的键被子表引用），关联的是source模型
        return getIncludeOptions(r, r.sourceTable === repo.tableName ? targetModel : sourceModel, CI);
    })
    // include 节点可以嵌套子include
    return relationShipModel.length ? {include: relationShipModel} : {};
}

/**
 * 生成数据库查询语句
 * @param request
 * @param relationShip
 * @param config
 * @param repo
 * @param CI
 * @param conditions
 * @param orders
 * @param subQuery 警告：如果允许子查询的话，和分页条件连用会生成子查询语句。然后在自查询语句中会将连接的表的顶级 where 条件放在子查询中，然后会报找不到字段的错误。这个是 sequelize 的 bug。
 * @return {({[string]: *}|number|{where: {}})[]}
 */
function getDQL(request, relationShip, config, repo, CI, conditions, orders) {

    let subQuery = true
    if(conditions && conditions.conditions) {
        const topLevelConditions = conditions.conditions
        for (let ownKey of Reflect.ownKeys(topLevelConditions)) {
            // 如果是 and 或 or 的符号变量条件,则判断其条件内容的 key 中是否包含子查询条件提升的定界符$  (注:符号变量条件的值可能是 array 或者 object)
            if (typeof ownKey === 'symbol' && (ownKey.toString().indexOf('or') > -1 || ownKey.toString().indexOf('and') > -1)) {
                if (topLevelConditions[ownKey] instanceof Array) {
                    if (topLevelConditions[ownKey].some(conditions => Object.keys(conditions).some( key => key.indexOf('$') > -1))) {
                        subQuery = false
                    }

                    if (!topLevelConditions[ownKey].length) {
                        // delete topLevelConditions[ownKey] // 注释此句：默认条件组为空的时候，该条件永不满足
                    }
                }
                if (topLevelConditions[ownKey] instanceof Object) {
                    if (Object.keys(topLevelConditions[ownKey]).some( key => key.indexOf('$') > -1)) {
                        subQuery = false
                    }

                    if (!Object.keys(topLevelConditions[ownKey]).length) {
                        // delete topLevelConditions[ownKey]  // 注释此句：默认条件组为空的时候，该条件永不满足
                    }
                }

            } else {
                if (ownKey.indexOf('$') > -1) subQuery = false
            }
        }

    }

    // 当使用 left join 时，如果是一对多的关系，那么主表记录会重复，需要加上去重配置。目前只要传入 relationship 即进行去重查询，暂不区分何种表联结方式
    const distinctOption = {distinct: true}

    // sequelize 在使用了子查询的情况下，无法对主表记录应用 distinct 约束(不存在的，sequelize 在sql查询阶段不会去重，但是会对查询结果进行去重)，所以如果有关联查询的情形下，强制不进行主表记录的子查询
    // subQuery = relationShip.length ? false : subQuery

    // 强制对主表记录进行子查询，否则分页会出现去重后数据不足的现象。但是这样一来，子表条件无法提升到顶级条件了
    // subQuery = true

    const filters = (request.body && request.body.filters) || []

    // 排序
    const oderQueryClause = getOderQueryClause(request, filters, orders);

    // 分页
    const pageQueryClause = getPageQueryClause(request);

    // 多表联查
    const relationShipQueryClause = buildRelationShip(relationShip, config, repo, CI);

    const whereClause = getDefaultWhereClauseByPostedRawFilters(filters, conditions, config, CI)

    if (request.body && request.body.filters && request.body.filters.some(e => e.key && e.key.indexOf('$') > -1)) {
        subQuery = false
    }

    const fields = getSelectFields(request, subQuery)

    const subQueryOption = !subQuery ? {subQuery: subQuery} : {}

    // 实测下来，对于常规查询，sequelize 会自动过滤重复记录并处理分页偏移量，对于聚合类查询则必须依赖 distinct 配置，否则聚合结果中会包含重复数据
    return [{
        ...distinctOption,
        ...fields, ...whereClause, ...pageQueryClause, ...oderQueryClause, ...relationShipQueryClause,
        ...subQueryOption
    }, {...whereClause, ...relationShipQueryClause, ...subQueryOption, ...distinctOption}];
}

/**
 * 查询结果集字段处理
 * @param {[{}]}result
 */
function processQueryResult(result = []) {
    result.forEach(row => {
        if (row instanceof Object) {
            // 子对象的 id 暂不处理
            Object.entries(row).forEach(([key, value], index) => {
                if (value instanceof Array) {
                    processQueryResult(value)
                } else if (value instanceof Object && !['_previousDataValues', '_changed', '_modelOptions', '_options'].includes(key)) {
                    processQueryResult([value])
                }
            })
            if (row.dataValues) row.dataValues.Id = row.id
            else row.Id = row.id
        }
    })
}

/**
 * @return {Promise<<Model<T, T2>[]>>}
 * @param CI
 * @param request
 * @param {BaseModel} model
 * @param {[{sourceTable: '', targetTable: '', schedule: 'many', options: AssociationOptions}, ..., {sourceTable: '', targetTable: '', schedule: 'one', options: AssociationOptions}]} relationShip
 * @param conditions
 * @param orders
 * @param scope - 模型作用域
 */
async function execIndex({CI}, request, model, relationShip = [], conditions, orders, scope) {

    const DQL = getDQL(request, relationShip, model, model, CI, conditions, orders);

    let result = {}
    try {
        result = await DQL[1] !== -1 ? {
            code: 0,
            data: scope ? await model.scope(scope).findAll(DQL[0]) : await model.findAll(DQL[0]),
            total: scope ? await model.scope(scope).count({...DQL[1], col: model.tableName + '.id'}) : await model.count({...DQL[1], col: model.tableName + '.id'})
        } : {code: 1, msg: 'INVALID_FILTERS'}
    } catch (e) {
        logger.error(e.stack)
        return {code: 1, msg: e.name}
    }

    const subQuery = DQL[2] || false
    // if (subQuery) processQueryResult(result.data) // 如果用了子查询，则需要遍历添加 Id 字段
    return result
}

/**
 * 为子查询对象构造顶层查询条件。如果构造后的条件/条件组为空，则会被 sequelize 认为该子条件默认不满足。所以使用该方法需要慎重
 * @param req
 * @param {{subModelNameorAlias: String, includeFields: [String]}} options
 * @return {{[string]: {} || ?}[]}
 */
function getTopLevelConditionsOfSubQuery(req, options) {
    if (req.body.filters) {
        return req.body.filters.filter(filter => options.includeFields.includes(filter.key)).map(filter => {
            const condition = {['$' + options.subModelNameorAlias + '.' + filter.key + '$']: {[getOp(filter.exp)]: filter.value}}
            // delete filter.key
            return condition
        })
    } else {
        return []
    }
}

module.exports = {OPERATORS, getOp, getTopLevelConditionsOfSubQuery, execIndex}