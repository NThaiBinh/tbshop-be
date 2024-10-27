const { getAllEmployees, createEmployee } = require('../models/employees')

async function getAllEmployeeHandler(req, res) {
    try {
        const page = req.query.page
        const employees = await getAllEmployees(page)
        return res.status(200).json(employees)
    }
    catch(err) {
        return res.status(500).json({
            meaasge: 'Server error',
            err
        })
    }
}

async function createEmployeeHandler(req, res) {
    const { positionId, name, birdth, address, phoneNumber, email } = req.body
    if(!positionId || !name || !phoneNumber || !email) {
        return res.status(400).json({
            message: 'Missing data'
        })
    }

    try {
        await createEmployee(req.body)
        return res.status(200).json({
            message: 'Create successfully'
        })
    }
    catch(err) {
        return res.status(500).json({
            message: 'Server error',
            err
        })
    }

}

async function employeeLogin(req, res) {

}

async function editEmployeeHandler(req, res) {

}

async function updateEmployeeHandler(req, res) {

}

async function deleteEmployeeHandler(req, res) {

}

module.exports = {
    getAllEmployeeHandler,
    createEmployeeHandler,
    employeeLogin,
    editEmployeeHandler,
    updateEmployeeHandler,
    deleteEmployeeHandler
}