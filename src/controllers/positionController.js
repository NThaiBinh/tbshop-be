const { getPositionBtId, getAllPositions, createPosition, updatePosition, deletePosition } = require('../models/positions')

async function getAllPositionHandler(req, res) {
    try {
        const page = req.query.page
        const  positions = await getAllPositions(page)
        return res.status(200).json(positions)
    }
    catch(err) {
        return res.status(500).json({
            message: 'Server error',
            err
        })
    }
}

async function createPositionHandler(req, res) {
    const { name } = req.body
    if(!name) {
        return res.status(400).json({
            message: 'Missing data'
        })
    }
    
    try {
        await createPosition(req.body)
        return res.status(200).json({
            meaasge: 'Create successfully'
        })
    }
    catch(err) {
        return res.status(500).json({
            meaasge: 'Server error',
            err
        })
    }
}

async function editPositionHandler(req, res) {
    const positionId = req.params.positionId
    if(!positionId) {
        return res.status(200).json({
            message: 'Missing data'
        })
    }

    try {
        const position = await getPositionBtId(positionId)
        if(!position) {
            return res.status(200).json({
                message: 'Position not found'
            })
        }
        return res.status(200).json(position)
    }
    catch(err) {
        return res.status(500).json({
            message: 'Server error',
            err
        })
    }
}

async function updatePositionHandler(req, res) {
    const positionId = req.params.positionId
    const { name } = req.body
    if(!positionId || !name) {
        return res.status(400).json({
            message: 'Missing data'
        })
    }

    try {
        await updatePosition({positionId, ...req.body})
        return res.status(200).json({
            message: 'Update successfully'
        })
    }
    catch(err) {
        return res.status(500).json({
            message: 'Server error',
            err
        })
    }
}

async function deletePositionHandler(req, res) {
    const positionId = req.params.positionId
    if(!positionId) {
        return res.status(400).json({
            message: 'Missing data'
        })
    }

    try {
        await deletePosition(positionId)
        return res.status(200).json({
            message: 'Delete successfully'
        })
    }
    catch(err) {
        return res.status(500).json({
            message: 'Server error',
            err
        })
    }
}

module.exports = {
    getAllPositionHandler,
    createPositionHandler,
    editPositionHandler,
    updatePositionHandler,
    deletePositionHandler
}