const supabase = require('../services/supabase');
const { getIO } = require('../services/socket');

const io = getIO()


// Get all contracts with pagination and filtering
const getAllContracts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            client_name,
            contract_id
        } = req.query;

        const offset = (page - 1) * limit;

        let query = supabase
            .from('contracts')
            .select('*', { count: 'exact' })
            .eq('active', true);

        if (status) query = query.eq('status', status);
        if (client_name)  query = query.ilike('client_name', `%${client_name}%`);
        if (contract_id)  query = query.eq('contract_id', contract_id);
        

        // Pagination
        const { data, error, count } = await query
            .range(offset, offset + limit - 1)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        res.json({
            contracts: data,
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit)
        });
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ error: error.message });
    }
}

// Get a single contract by contract_id
const getContractById = async (req, res) => {
    try {
        const { contract_id } = req.params;
        const { data, error } = await supabase
            .from('contracts')
            .select('*')
            .eq('contract_id', contract_id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Contract not found' });

        res.json(data);
    } catch (error) {
        console.error('Error fetching contract:', error);
        res.status(500).json({ error: error.message });
    }
}

// Create a new contract
const createContract = async (req, res) => {
    try {
        const { client_name, content, status = 'Draft' } = req.body;

        // Validate required fields
        if (!client_name || !content) {
            return res.status(400).json({ error: 'Missing required fields: client_name, and content are required' });
        }

        const { data, error } = await supabase
            .from('contracts')
            .insert([{
                client_name,
                // contract_id,
                content,
                status
            }])
            .select();

        if (error) throw error;
        

        // Emit socket event for real-time update
        io.emit('contract:created', data[0]);

        res.status(201).json(data[0]);
    } catch (error) {
        console.error('Error creating contract:', error);
        res.status(500).json({ error: error.message });
    }
}

// Update a contract
const updateContract = async (req, res) => {
    try {
        const { contract_id } = req.params;
        const { client_name, content, status } = req.body;

        const updateData = {};
        if (client_name !== undefined) updateData.client_name = client_name;
        if (content !== undefined) updateData.content = content;
        if (status !== undefined) updateData.status = status;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        const { data, error } = await supabase
            .from('contracts')
            .update(updateData)
            .eq('contract_id', contract_id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ error: 'Contract not found' });
        
        // Emit socket event for real-time update
        io.emit('contract:updated', data[0]);

        res.json(data[0]);
    } catch (error) {
        console.error('Error updating contract:', error);
        res.status(500).json({ error: error.message });
    }
}

// Delete a contract
const deleteContract = async (req, res) => {
    try {
        const { contract_id } = req.params;

        const { data, error } = await supabase
            .from('contracts')
            .update({ active: false })//soft delete instead of hard deleting
            .eq('contract_id', contract_id)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) return res.status(404).json({ error: 'Contract not found' });

        // Emit socket event for real-time update
        io.emit('contract:deleted', { contract_id: parseInt(contract_id) });

        res.json({ message: 'Contract deleted successfully' });
    } catch (error) {
        console.error('Error deleting contract:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getAllContracts,
    getContractById,
    createContract,
    updateContract,
    deleteContract
}