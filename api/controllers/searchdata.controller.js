import SearchData from '../models/search.model.js'; // Model to store search data in the database

// Controller to get previous search data for a user
export const getSearchData = async (req, res) => {
    const { userId } = req.params;  // Get user ID from URL parameter

    try {
        // Retrieve all search data for the given user, sorted by most recent
        const searchData = await SearchData.find({ userId }).sort({ createdAt: -1 });

        if (!searchData) {
            return res.status(404).json({ error: 'No search data found for this user' });
        }

        // Send back the search data
        res.status(200).json(searchData);
    } catch (error) {
        console.error('Error fetching search data:', error);
        res.status(500).json({ error: 'Failed to fetch search data' });
    }
};

// Controller to delete search data
export const deleteSearchData = async (req, res) => {
    try {
        const { id } = req.params; // Get the search data ID from URL parameter
        const deletedItem = await SearchData.findByIdAndDelete(id); // Delete search data by ID

        if (!deletedItem) {
            return res.status(404).json({ error: 'Search data not found' });
        }

        // Send success response
        res.status(200).json({ message: 'Search data deleted successfully' });
    } catch (error) {
        console.error('Error deleting search data:', error);
        res.status(500).json({ error: 'Failed to delete search data' });
    }
};