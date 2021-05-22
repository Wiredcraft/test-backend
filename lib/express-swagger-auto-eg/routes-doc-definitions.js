/**
 * Created by eagleQL on 4/8 2020.
 */
module.exports = {
    defaultAPIs: {
        ['/index']:   {desc:'列表', request: 'requestListBodyNode', response: 'responseList'},
        ['/view']:    {desc:'详情', request: 'requestViewBodyNode', response: 'responseList' },
        ['/create']:  {desc:'创建', request: 'requestCreateBodyNode', response: 'responseList'},
        ['/update']:  {desc:'更新', request: 'requestUpdateBodyNode', response: 'responseList'},
        ['/destroy']: {desc:'删除（逻辑删除）', request: 'requestDestroyBodyNode', response: 'responseList'}
    }

}