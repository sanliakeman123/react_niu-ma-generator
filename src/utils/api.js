import http from "./httpRequests";
import http2 from "./httpRequestsFile";


export function databasesHttp(dataSource) {
    return http.post(`jdbc/databases`,dataSource)
}

export function testUrl(dataSource) {
    return http.post(`jdbc/testUrl`,dataSource)
}

export function syncTables(dataSource) {
    return http.post(`jdbc/syncTables`,dataSource)
}

export function makeFile(sourceUuid,templateUuid) {
    
    return http2.get(`make/file?sourceUuid=${sourceUuid}&templateUuid=${templateUuid}`,{responseType:'blob'})
}
export function makeDictFile(sourceUuid,templateUuid) {
    
    return http2.get(`make/dictFile?sourceUuid=${sourceUuid}&templateUuid=${templateUuid}`,{responseType:'blob'})
}

export function makeJoinFile(sourceUuid,templateUuid) {
    
    return http2.get(`make/joinFile?sourceUuid=${sourceUuid}&templateUuid=${templateUuid}`,{responseType:'blob'})
}

export function dataSourcePage(pagequery) {
    return http.post(`dataSource/page`,pagequery)
}

export function dataSourceNotPage(query) {
    return http.post(`dataSource/list`,query)
}

export function dataSourceSave(pagequery) {
    return http.post(`dataSource/save`,pagequery)
}

export function dataSourceSelectByUuid(uuid) {
    return http.post(`dataSource/selectByUuid?uuid=${uuid}`)
}

export function dataSourceDeleteByUuid(uuid) {
    return http.post(`dataSource/deleteByUuid?uuid=${uuid}`)
}


export function dataTableSelectBySourceUuid(sourceUuid) {
    return http.post(`dataTable/selectBySourceUuid?sourceUuid=${sourceUuid}`)
}

export function dataTableSelectMapBySourceUuid(sourceUuid) {
    return http.post(`dataTable/selectMapBySourceUuid?sourceUuid=${sourceUuid}`)
}

export function dataTableSave(entity) {
    return http.post(`dataTable/save`,entity)
}

export function dataTableList(entity) {
    return http.post(`dataTable/list`,entity)
}
export function dataTablePage(pagequery) {
    return http.post(`dataTable/page`,pagequery)
}

export function dataMetadataPage(pagequery) {
    return http.post(`dataMetadata/page`,pagequery)
}

export function dataMetadataNotPage(query) {
    return http.post(`dataMetadata/list`,query)
}

export function dataMetadataSave(pagequery) {
    return http.post(`dataMetadata/save`,pagequery)
}

export function dataMetadataSaveList(fields) {
    return http.post(`dataMetadata/saveList`,fields)
}

export function dataMetadataSelectByUuid(uuid) {
    return http.post(`dataMetadata/selectByUuid?uuid=${uuid}`)
}

export function dataMetadataSelectByTableUuid(tableUuid) {
    return http.post(`dataMetadata/selectByTableUuid?tableUuid=${tableUuid}`)
}

export function dataMetadataDeleteByUuid(uuid) {
    return http.post(`dataMetadata/deleteByUuid?uuid=${uuid}`)
}

export function templateConfigPage(pagequery) {
    return http.post(`templateConfig/page`,pagequery)
}

export function templateConfigNotPage(query) {
    return http.post(`templateConfig/list`,query)
}

export function templateConfigSave(pagequery) {
    return http.post(`templateConfig/save`,pagequery)
}

export function templateConfigSelectByUuid(uuid) {
    return http.post(`templateConfig/selectByUuid?uuid=${uuid}`)
}

export function templateConfigDeleteByUuid(uuid) {
    return http.post(`templateConfig/deleteByUuid?uuid=${uuid}`)
}

export function dataFieldCombinationSelectByTableUuid(tableUuid) {
    return http.post(`dataFieldCombination/selectByTableUuid?tableUuid=${tableUuid}`)
}

export function dataFieldCombinationNotPage(entity) {
    return http.post(`dataFieldCombination/list`,entity)
}

export function dataFieldCombinationSave(entity) {
    return http.post(`dataFieldCombination/save`,entity)
}

export function dataFieldCombinationDeleteByUuid(uuid) {
    return http.post(`dataFieldCombination/deleteByUuid?uuid=${uuid}`)
}

export function dataFieldCombinationSelectSelectByCombinationUuid(combinationUuid) {
    return http.post(`dataFieldCombinationSelect/selectByCombinationUuid?combinationUuid=${combinationUuid}`)
}

export function dataFieldCombinationSelectSave(entity) {
    return http.post(`dataFieldCombinationSelect/save`,entity)
}

export function dataFieldCombinationSelectDeleteByUuid(uuid) {
    return http.post(`dataFieldCombinationSelect/deleteByUuid?uuid=${uuid}`)
}

export function dataDictPage(pagequery) {
    return http.post(`dataDict/page`,pagequery)
}


export function dataDictSelectByUuid(uuid) {
    return http.post(`dataDict/selectByUuid?uuid=${uuid}`)
}

export function dataDictSave(entity) {
    return http.post(`dataDict/save`,entity)
}


export function dataDictDeleteByUuid(uuid) {
    return http.post(`dataDict/deleteByUuid?uuid=${uuid}`)
}

export function dataDictStaticNotPage(query) {
    return http.post(`dataDictStatic/list`,query)
}
export function dataDictStaticSelectByDictUuid(dictUuid) {
    return http.post(`dataDictStatic/selectByDictUuid?dictUuid=${dictUuid}`)
}

export function dataDictStaticSave(entity) {
    return http.post(`dataDictStatic/save`,entity)
}

export function dataDictStaticDeleteByUuid(uuid) {
    return http.post(`dataDictStatic/deleteByUuid?uuid=${uuid}`)
}

export function unRealTablePage(pagequery) {
    return http.post(`unRealTable/page`,pagequery)
}
export function unRealTableSave(entity) {
    return http.post(`unRealTable/save`,entity)
}

export function unRealTableDeleteByUuid(uuid) {
    return http.post(`unRealTable/deleteByUuid?uuid=${uuid}`)
}

export function unRealTableSelectByUuid(uuid) {
    return http.post(`unRealTable/selectByUuid?uuid=${uuid}`)
}

export function unRealTableSubSelectByParentUuid(parentUuid) {
    return http.post(`unRealTableSub/selectByUnRealTableUuid?unRealTableUuid=${parentUuid}`)
}

export function unRealTableSubSave(entity) {
    return http.post(`unRealTableSub/save`,entity)
}

export function unRealTableSubDeleteByUuid(uuid) {
    return http.post(`unRealTableSub/deleteByUuid?uuid=${uuid}`)
}

export function unRealFieldSelectUnRealTableSubUuid(unRealTableSubUuid) {
    return http.post(`unRealFieldSelect/selectByUnRealTableSubUuid?unRealTableSubUuid=${unRealTableSubUuid}`)
}

export function unRealFieldSelectSave(entity) {
    return http.post(`unRealFieldSelect/save`,entity)
}

export function unRealFieldSelectDeleteByUuid(uuid) {
    return http.post(`unRealFieldSelect/deleteByUuid?uuid=${uuid}`)
}

export function unRealFieldWhereUnRealTableSubUuid(unRealTableSubUuid) {
    return http.post(`unRealFieldWhere/selectByUnRealTableSubUuid?unRealTableSubUuid=${unRealTableSubUuid}`)
}

export function unRealFieldWhereSave(entity) {
    return http.post(`unRealFieldWhere/save`,entity)
}

export function unRealFieldWhereDeleteByUuid(uuid) {
    return http.post(`unRealFieldWhere/deleteByUuid?uuid=${uuid}`)
}