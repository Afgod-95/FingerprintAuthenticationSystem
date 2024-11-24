const userModel = require('../../model/dbStructure');
const jwt = require('jsonwebtoken');

// Student login startpoint
module.exports.studentLogin = async (req, res) => {
    try {
        const { fingerprintId } = req.body;

        // Check if fingerprint ID is provided
        if (!fingerprintId ) {
            return res.status(400).json({ error: "Please provide a fingerprint id" });
        }

        // Find the student by fingerprint ID
        const studentExist = await userModel.findOne({ fingerprintID: fingerprintId });
        if (!studentExist || studentExist.role === 'admin') {
            return res.status(400).json({ error: 'Invalid fingerprint ID' });
        }

        const currentTime = new Date();
        const examTime = {
            hour: currentTime.getHours(),
            minute: currentTime.getMinutes(),
            period: currentTime.getHours() >= 12 ? 'PM' : 'AM'
        };

        // Generate tokens
        const token = jwt.sign({ userID: studentExist._id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
        });

        const refreshToken = jwt.sign({ userID: studentExist._id }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
        });

        // Update the student's data in the database
        studentExist.status = "Present";
        studentExist.examStatus = "Written";
        studentExist.examTime = examTime;
        studentExist.lastLogin = currentTime;
        studentExist.refreshToken = refreshToken;

        await studentExist.save();

        res.status(200).json({
            message: 'Student logged in successfully',
            student: studentExist,
            token,
            refreshToken
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.log(`Student login error: ${error.message}`);
    }
};
