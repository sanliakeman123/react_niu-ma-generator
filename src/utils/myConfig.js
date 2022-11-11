const config = {
    dataBaseAutorList:[
        {label:"mysql", value:"0"},
        {label:"人大金仓", value:"1"}
    ],
    resTypeList:[
        {label:"单个", value:0},
        {label:"集合", value:1}
    ],
    elementTypeList:[
        {label:"单行文本", value:"0",dict:false},
        {label:"多行文本", value:"1",dict:false},
        {label:"下拉单选", value:"2",dict:true},
        {label:"下拉多选", value:"3",dict:true},
        {label:"单选框", value:"4",dict:true},
        {label:"多选框", value:"5",dict:true},
        {label:"弹框单选", value:"6",dict:true},
        {label:"弹框多选", value:"7",dict:true}
    ],
    dictList:[
        {label:"静态", value:0,open:true},
        {label:"动态表", value:1,open:false}
    ],
    dictContentTypeList:[
        {label:"固定值", value:"0"},
        {label:"动态值", value:"1"}
    ],
    whereTypeList:[
        {label:"全等", value:0},
        {label:"模糊搜索", value:1},
        {label:"字段在左(find_in_set)", value:2},
        {label:"字段在右(find_in_set)", value:3},
        {label:"大于", value:4},
        {label:"大于等于", value:5},
        {label:"小于", value:6},
        {label:"小于等于", value:7},
        {label:"默认值", value:8},
        {label:"为空", value:9}
    ]

}

export default config;