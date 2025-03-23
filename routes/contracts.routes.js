const express = require('express');
const router = express.Router();

//controllers
const { getAllContracts, getContractById, createContract, updateContract, deleteContract } = require('../controllers/contracts.controller');


// Get all contracts with pagination and filtering
router.get('/', getAllContracts);

// Get a single contract by ID
router.get('/:contract_id', getContractById);

// Create a new contract
router.post('/', createContract);

// Update a contract
router.put('/:contract_id', updateContract);

// Delete a contract
router.delete('/:contract_id', deleteContract);

module.exports = router;