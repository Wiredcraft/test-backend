window.$cssList = ['/css/animate.css', '/css/shared.css', '/css/common.css']

window.$config = {
    searchPlaceholder: 'Search Here...',
    defaultColor: {
        title: '#212131',
        text: '#343434'
    },
    defaultDesc: [{
        title: "酒店介绍"
    }, {
        text: "内容简介..."
    }],
    'left-bar': {
        logo: '/logo.jpg',
        // placeholder: '搜索学员、员工、客房',
        menu: [{
            icon: 'home',
            items: [{
                title: '首页',
                eng: 'Overview',
                screen: 'home-overview'
            }]
        }, {
            icon: 'people-circle-outline',
            items: [{
                title: '用户列表',
                eng: 'Members',
                screen: 'member-list'
            }, {
                title: '操作日志',
                eng: 'Recently',
                screen: 'the-logs'
            }]

        }, {
            icon: 'cog',
            items: [{
                title: '登陆历史',
                screen: 'the-sessions',
                eng: 'Sessions'
            }]
        }]
    },
    'tab-bar': {
        default: [{
            name: '首页',
            uri: 'home-overview'
        }]
    }
}