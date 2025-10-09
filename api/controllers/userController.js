const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // Check if user is updating their own profile
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to update this user' 
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private
exports.deleteUser = async (req, res) => {
    try {
        // Check if user is deleting their own profile
        if (req.user.id !== req.params.id) {
            return res.status(403).json({ 
                success: false, 
                message: 'Not authorized to delete this user' 
            });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
};
