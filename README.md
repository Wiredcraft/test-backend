# 测试项目说明
## 实现了哪些功能
- orm 层, 使用 sequelize 封装,可动态切换数据库
- controller 层, 使用express 实现标准的RESTFUL 接口. (列表查询除外,因为要提交复杂的筛选提交,所以暂用 post 方法).常用接口无需手写,
    只要定义了 model,常规接口自动生成
- 缓存等,使用 node-cache 轻量实现
- 用户模块: 用户的增删改查接口\用户的互相关注关系治理接口\用户周围指定范围的用户查询接口
- Auth 模块: 因为时间紧张,所以起初打算使用 github 的 oauth功能来充当认证中心, 但是中途发现 github 兑换 access_token 的 url 是 404,
   因为时间实在不够,所以暂时没有继续做 oauth2 的集成了(因为需要额外实现一套认证服务,我的时间比较紧张)
- 增删改查级联: 本项目已经封装了这些逻辑,常用的级联查询及更新\删除操作无需手动写代码
- 数据库维护: 本项目会自动创建数据库, 表, 更新表字段, 插入初始数据
- 本项目基于 swagger-ui 实现了自动文档 (详见下方)
- 本项目winston 和 morgan实现了根据运行环境变化级别的日志

## quick-start
- cd project root path
- modify /config.js: MYSQL_CONFIG
- `yarn install`
- `npm run dev`
- server listen on localhost port: 3001
- API document url: http://127.0.0.1:3001/api-docs

## quick-test
- cd project root path
- npm run test

# 基于 orm （sequelize）的基本控制器、数据模型使用注意事项

## 有关 restful API
本项目默认实现了 5 个常规接口, 一旦在 orm/model 目录下建立了继承于 BaseModel 的模型,应用启动时即可为该模型生成同名的 router,
并且自动具有以下 5 个接口:
- post('/{modelName.lowercase}/list')  
    列表查询,支持条件筛选: 
    post.body: {filters: [{key: 'field-key', exp: '=|!=| > | < |>= | <= | like | in ...', value: value}]}
    此外还支持分页: post.body: {begin:0, count: 10}
- get('/{modelName.lowercase}/:id')
- post('/{modelName.lowercase}')
- put('/{modelName.lowercase}')
- delete('/{modelName.lowercase}')

详细接口文档(需要启动项目):  http://127.0.0.1:3001/api-docs

## 有关 swagger 文档
项目启动后访问: http://127.0.0.1:3001/api-docs
### 实现方式
本项目使用开源的 swagger-ui 组件进行二开,自动读取项目中的 models 和 routers,通过定制一些基本的文档格式,动态将项目中的 api 模块输出成
在线文档.

### 有关项目的多租户结构
该项目部分代码迁移自我的另外一个多租户项目,保留了多租户的少部分逻辑,不影响正常测试和演示


## 模型循环依赖对治
核心思想:需要保证被其它模型依赖的模型首先被 require 导入(尤其优先循环依赖的模型).

如果项目中有 require-all,则该导入方式是按照字母顺序导入的,所以有个技巧,可以在字母最小的那个模型里导入被循环依赖的模型;

在上述导入方式的情形下,则要注意手动导入模型的顺序,保持被循环依赖的模型以及被普通依赖的模型最新导入.

如果项目使用了sequelize.sync()方法,则该方法貌似会智能处理循环依赖.

本项目使用了require-all对所有模型进行预加载,没有使用sequelize.sync()而是使用 model.schema('schemaName').sync()进行数据库结构同步,
所以本项目在 DataLabel 模型中引入了 User 模型,从而避免了 User 被循环依赖时报错的问题.
## Model 的定义
- 如果有级联操作的需要，注意定义相关初始化相关属性：CascadeModel、CascadeManyToManyModel
- 注意避免定义循环引用的模型，如查询时， A 和 B 互相持有对方的引用（通过 include）。如果实在有需求，可以把其中一方的引用写到 scope 里。
## 级联创建/更新/删除
- 一对 N： 传参时传目标模型的别名，内容是目标对象 json 数据。如果目标的外键持有者，则在 update 时会把老的关联记录删除。否则不会。
- 多对多：传参时传目标模型的别名，内容是目标表记录的 id 数组
- 如何禁用级联:
    ``` javascript
    User.belongsToMany(Group, {through: GroupMember, constraints: false, cascadeExcludes: ['create', 'update']})
    ```
  在cascadeExcludes中指定需要禁用的 scope 即可
## 级联查询
### 方法一
在查询之前才指定关联关系，并在 find 方法 option 内指定 include
### 方法二
在 model 定义之后导出之前(如果 model 之间互相引用了对方，那么最好把其它 model 的应用及关联句子放在 exports 之后)，用 Model 的静态方法去定义关联关系，并在 model 的 defaultScope 中指定 include。注意，如果定义了 N:N关系，
则系统在建表时中间表的主键为 2 个外键的复合主键，没有 id，所以不能通过这个中间表的接口操作。如果确实需要 id 主键的话，模型中这样定义
```javascript
id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
```
这样将不会自动创建复合主键
### 方法三
如果有更精细的关联查询，可以在前两种方法定义关联关系的时候，指定 scope。如：
```javascript
User.hasOne(DataLabel, {as: 'UserTypeValue', foreignKey:'id', sourceKey: 'UserType', constraints: false, scope: 'findUserType'})
```
这个特性还没试过。
## 对关联表的排序
如果希望关联数据进行排序，则可以直接在查询中指定order排序规则。
```javascript
const meeting = User.findAll({
    where: {
        id: 1,
        order: [
            // 主表排序
            ['id', 'asc'],
            // 关联表排序
            [Groups, 'id', 'asc'],
        ],
    },
    include: [Groups],
})
```
## 对关联表的条件查询
以子表的某个字段查询时,貌似会导致列表查询分页偏移量出问题,所以如果有这种需求还是建议在主表建立物理字段,
或者主表的模型的钩子或者 scope 里加入 sequelize.literal 生成的原生 sql子查询字段.
有些情况下如果实在需要这样查询, 条件格式可以是以下两种之一:
```javascript
where: {
'$table2->subTable.field1$': value,
'$table3.field2$': value2
}
```

