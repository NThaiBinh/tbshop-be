const connectionPool = require('../config/dbConfig')
const sql = require('mssql')
const { GetDate, CreateKey } = require('../utils/lib')

const columns = [
   'MACAUHINH',
   'MASP',
   'HEDIEUHANH',
   'CPU',
   'GPU',
   'TOCDOCPU',
   'SONHAN',
   'SOLUONG',
   'TOCDOTOIDA',
   'BONHODEM',
   'RAM',
   'LOAIRAM',
   'DUNGLUONG',
   'DUNGLUONGKHADUNG',
   'CAMERATRUOC',
   'CONGNGHECAMERATRUOC',
   'CAMERASAU',
   'CONGNGHECAMERASAU',
   'MANHINH',
   'DOPHANGIAI',
   'TANGSOQUET',
   'DOPHUMAU',
   'CONGNGHEMANHINH',
   'DOSANG',
   'SAC',
   'CHATLIEU',
   'KHOILUONG',
   'CONGGIAOTIEP',
   'KHONGDAY',
   'DENBANPHIM',
   'NGAYTAO',
   'NGAYCAPNHAT',
]

async function createProductConfiguration(productConfiguration, productId) {
   const {
      operatingSystem,
      cpu,
      gpu,
      cpuSpeed,
      core,
      threads,
      maxSpeed,
      cacheCPU,
      ram,
      ramType,
      monitor,
      resolution,
      refreshRate,
      colorCoverage,
      monitorTechnology,
      brightness,
      storageCapacity,
      availableStorageCapacity,
      frontCamera,
      frontCameraTechnology,
      backCamera,
      backCameraTechnology,
      charging,
      material,
      weight,
      port,
      wireless,
      keyboardLight,
   } = productConfiguration
   const productConfigurationId = CreateKey('CH_')
   const createAt = GetDate()
   const updateAt = GetDate()

   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('productId', sql.TYPES.VarChar, productId)
         .input('operatingSystem', sql.TYPES.VarChar, operatingSystem)
         .input('cpu', sql.TYPES.NVarChar, cpu)
         .input('gpu', sql.TYPES.NVarChar, gpu)
         .input('cpuSpeed', sql.TYPES.VarChar, cpuSpeed)
         .input('core', sql.TYPES.VarChar, core)
         .input('threads', sql.TYPES.VarChar, threads)
         .input('maxSpeed', sql.TYPES.VarChar, maxSpeed)
         .input('cacheCPU', sql.TYPES.VarChar, cacheCPU)
         .input('ram', sql.TYPES.VarChar, ram)
         .input('ramType', sql.TYPES.NVarChar, ramType)
         .input('storageCapacity', sql.TYPES.VarChar, storageCapacity)
         .input('availableStorageCapacity', sql.TYPES.VarChar, availableStorageCapacity)
         .input('frontCamera', sql.TYPES.NVarChar, frontCamera)
         .input('frontCameraTechnology', sql.TYPES.NVarChar, frontCameraTechnology)
         .input('backCamera', sql.TYPES.NVarChar, backCamera)
         .input('backCameraTechnology', sql.TYPES.NVarChar, backCameraTechnology)
         .input('monitor', sql.TYPES.VarChar, monitor)
         .input('resolution', sql.TYPES.VarChar, resolution)
         .input('refreshRate', sql.TYPES.VarChar, refreshRate)
         .input('colorCoverage', sql.TYPES.VarChar, colorCoverage)
         .input('monitorTechnology', sql.TYPES.VarChar, monitorTechnology)
         .input('brightness', sql.TYPES.VarChar, brightness)
         .input('charging', sql.TYPES.NVarChar, charging)
         .input('material', sql.TYPES.NVarChar, material)
         .input('weight', sql.TYPES.NVarChar, weight)
         .input('port', sql.TYPES.NVarChar, port)
         .input('wireless', sql.TYPES.VarChar, wireless)
         .input('keyboardLight', sql.TYPES.NVarChar, keyboardLight)
         .input('createAt', sql.TYPES.DateTimeOffset, createAt)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`INSERT INTO CAUHINH (${columns}) VALUES (
                     @productConfigurationId,
                     @productId, 
                     @operatingSystem, 
                     @cpu,
                     @gpu, 
                     @cpuSpeed,
                     @core, 
                     @threads,
                     @maxSpeed,
                     @cacheCPU,
                     @ram,
                     @ramType,
                     @storageCapacity,
                     @availableStorageCapacity,
                     @frontCamera,
                     @frontCameraTechnology,
                     @backCamera,
                     @backCameraTechnology,
                     @monitor,
                     @resolution,
                     @refreshRate,
                     @colorCoverage,
                     @monitorTechnology,
                     @brightness,
                     @charging,
                     @material,
                     @weight,
                     @port,
                     @wireless,
                     @keyboardLight,
                     @createAt,
                     @updateAt)`)
   })
}

async function getProductConfiguration(productConfigurationId) {
   return await connectionPool
      .then((pool) =>
         pool
            .request()
            .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
            .query('SELECT * FROM CAUHINH WHERE MACAUHINH = @productConfigurationId'),
      )
      .then((productConfiguration) => productConfiguration.recordset[0])
}

async function updateProductConfiguration(productConfiguration, productConfigurationId) {
   const {
      operatingSystem,
      cpu,
      gpu,
      cpuSpeed,
      core,
      threads,
      maxSpeed,
      cacheCPU,
      ram,
      ramType,
      monitor,
      resolution,
      refreshRate,
      colorCoverage,
      monitorTechnology,
      brightness,
      storageCapacity,
      availableStorageCapacity,
      frontCamera,
      frontCameraTechnology,
      backCamera,
      backCameraTechnology,
      charging,
      material,
      weight,
      port,
      wireless,
      keyboardLight,
   } = productConfiguration
   const updateAt = GetDate()

   await connectionPool.then((pool) =>
      pool
         .request()
         .input('productConfigurationId', sql.TYPES.VarChar, productConfigurationId)
         .input('operatingSystem', sql.TYPES.VarChar, operatingSystem)
         .input('cpu', sql.TYPES.NVarChar, cpu)
         .input('gpu', sql.TYPES.NVarChar, gpu)
         .input('cpuSpeed', sql.TYPES.VarChar, cpuSpeed)
         .input('core', sql.TYPES.VarChar, core)
         .input('threads', sql.TYPES.VarChar, threads)
         .input('maxSpeed', sql.TYPES.VarChar, maxSpeed)
         .input('cacheCPU', sql.TYPES.VarChar, cacheCPU)
         .input('ram', sql.TYPES.VarChar, ram)
         .input('ramType', sql.TYPES.NVarChar, ramType)
         .input('storageCapacity', sql.TYPES.VarChar, storageCapacity)
         .input('availableStorageCapacity', sql.TYPES.VarChar, availableStorageCapacity)
         .input('frontCamera', sql.TYPES.NVarChar, frontCamera)
         .input('frontCameraTechnology', sql.TYPES.NVarChar, frontCameraTechnology)
         .input('backCamera', sql.TYPES.NVarChar, backCamera)
         .input('backCameraTechnology', sql.TYPES.NVarChar, backCameraTechnology)
         .input('monitor', sql.TYPES.VarChar, monitor)
         .input('resolution', sql.TYPES.VarChar, resolution)
         .input('refreshRate', sql.TYPES.VarChar, refreshRate)
         .input('colorCoverage', sql.TYPES.VarChar, colorCoverage)
         .input('monitorTechnology', sql.TYPES.VarChar, monitorTechnology)
         .input('brightness', sql.TYPES.VarChar, brightness)
         .input('charging', sql.TYPES.NVarChar, charging)
         .input('material', sql.TYPES.NVarChar, material)
         .input('weight', sql.TYPES.NVarChar, weight)
         .input('port', sql.TYPES.NVarChar, port)
         .input('wireless', sql.TYPES.VarChar, wireless)
         .input('keyboardLight', sql.TYPES.NVarChar, keyboardLight)
         .input('updateAt', sql.TYPES.DateTimeOffset, updateAt).query(`UPDATE CAUHINH SET 
            ${columns[2]} = @operatingSystem,
            ${columns[3]} = @cpu,
            ${columns[4]} = @gpu,
            ${columns[5]} = @cpuSpeed,
            ${columns[6]} = @core,
            ${columns[7]} = @threads,
            ${columns[8]} = @maxSpeed,
            ${columns[9]} = @cacheCPU,
            ${columns[10]} = @ram,
            ${columns[11]} = @ramType,
            ${columns[12]} = @storageCapacity,
            ${columns[13]} = @availableStorageCapacity,
            ${columns[14]} = @frontCamera,
            ${columns[15]} = @frontCameraTechnology,
            ${columns[16]} = @backCamera,
            ${columns[17]} = @backCameraTechnology,
            ${columns[18]} = @monitor,
            ${columns[19]} = @resolution,
            ${columns[20]} = @refreshRate,
            ${columns[21]} = @colorCoverage,
            ${columns[22]} = @monitorTechnology,
            ${columns[23]} = @brightness,
            ${columns[24]} = @charging,
            ${columns[25]} = @material,
            ${columns[26]} = @weight,
            ${columns[27]} = @port,
            ${columns[28]} = @wireless,
            ${columns[29]} = @keyboardLight,
            ${columns[31]} = @updateAt
            WHERE ${columns[0]} = @productConfigurationId`),
   )
}

//            ,
//
async function deleteProductConfiguration(productId) {
   await connectionPool.then((pool) => {
      return pool
         .request()
         .input('productId', sql.TYPES.VarChar, productId)
         .query('DELETE CAUHINH WHERE MASP = @productId')
   })
}

module.exports = {
   createProductConfiguration,
   getProductConfiguration,
   updateProductConfiguration,
   deleteProductConfiguration,
}
