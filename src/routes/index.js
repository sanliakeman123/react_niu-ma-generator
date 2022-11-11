import Index from "../pages/admin/dashboard/Index";
import DataSourceIndex from "../pages/admin/datasource/Index";
import DataTableIndex from "../pages/admin/dataTable/Index";
import TemplateConfigIndex from "../pages/admin/templateConfig/Index";
import DataDictIndex from "../pages/admin/dataDict/Index";
import UnRealTableIndex from "../pages/admin/unReal/TableZ";
import Login from "../pages/Login";
import PageNotFound from "../pages/PageNotFound";
import { AreaChartOutlined } from '@ant-design/icons';
export const mainRoutes = [
    {
        path:"/",
        element: <Login/>
    },
    {
        path:"/404",
        element: <PageNotFound/>
    }
];

export const adminRoutes = [
    {
        path:"/admin/dashboard",
        isShow:true,
        title:"看板",
        icon:<AreaChartOutlined />,
        element:<Index/>,
        id:"adminDashboard"
    },
    {
        path:"/admin/datasource",
        isShow:true,
        title:"数据源管理",
        icon:<AreaChartOutlined />,
        element:<DataSourceIndex/>,
        id:"adminDatasource"
    },
    {
        path:"/admin/dataTable",
        isShow:true,
        title:"数据表管理",
        icon:<AreaChartOutlined />,
        element:<DataTableIndex/>,
        id:"adminDataTable"
    },
    {
        path:"/admin/unRealTable",
        isShow:true,
        title:"虚拟表管理",
        icon:<AreaChartOutlined />,
        element:<UnRealTableIndex/>,
        id:"adminUnRealTable"
    },
    {
        path:"/admin/templateConfig",
        isShow:true,
        title:"模板管理",
        icon:<AreaChartOutlined />,
        element:<TemplateConfigIndex/>,
        id:"adminTemplateConfig"
    },
    {
        path:"/admin/dataDict",
        isShow:true,
        title:"字典管理",
        icon:<AreaChartOutlined />,
        element:<DataDictIndex/>,
        id:"adminDataDict"
    }
]