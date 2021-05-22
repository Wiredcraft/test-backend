/**
 * Created by eagleQL on 4/8 2020.
 */
module.exports = {
    defaultAPIs: {
        ['post:/list']:   {desc:'列表', request: 'requestListBodyNode', response: 'responseList'},
        ['get:/:id']:    {desc:'详情', request: 'requestViewBodyNode', response: 'responseObject' },
        ['post:/']:  {desc:'创建', request: 'requestCreateBodyNode', response: 'responseObject'},
        ['put:/']:  {desc:'更新', request: 'requestUpdateBodyNode', response: 'responseObject'},
        ['delete:/']: {desc:'删除（逻辑删除）', request: 'requestDestroyBodyNode', response: 'responseObject'}
    }

}