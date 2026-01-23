// auth.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./Database'); 
const validator = require('validator');


const signup = (req, res) => {
    const { name, age, email, password } = req.body;

    if (!name || !age || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special symbol"
        });
    }

    const search_query = "SELECT email FROM subscriber WHERE email=?";
    const insert_query = "INSERT INTO subscriber(name, age, email, password) VALUES(?,?,?,?)";

    db.query(search_query, [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });

        if (result.length > 0) {
            return res.status(400).json({ error: "User already exists" });
        }

        try {
            const hashed_password = await bcrypt.hash(password, 9);

            db.query(insert_query, [name, age, email, hashed_password], (err, userResult) => {
                if (err) {
                    console.log("User Insert Error:", err);
                    return res.status(500).json({ error: "Error inserting user" });
                }

                const userId = userResult.insertId;
                const insert_profile_query =
                    "INSERT INTO profiles(user_id, full_name, email, language, timezone) VALUES(?,?,?,?,?)";

                db.query(insert_profile_query, [userId, name, email, "English", "GMT-5"], (err, profileResult) => {
                    if (err) {
                        console.log("Profile Insert Error:", err);
                        return res.status(500).json({ error: "Error inserting profile" });
                    }

                    res.json({ msg: "User & profile created successfully" });
                });
            });
        } catch (e) {
            res.status(500).json({ error: "Password hashing failed" });
        }
    });
};


const signin = (req, res) => {
    const { email, password } = req.body;
    const select_query = "SELECT id, email, password FROM subscriber WHERE email=?";

    db.query(select_query, [email], async (err, result) => {
        if (err) return res.status(500).json({ error: "Signin selection failed" });
        if (result.length === 0) {
            return res.status(400).json({ error: "Invalid Username" });
        }
        const { id, password: password_database } = result[0];

        try {
            const isMatch = await bcrypt.compare(password, password_database);

            if (isMatch) {
                const token = jwt.sign({ id: id }, process.env.JWT_KEY, { expiresIn: '1d' });

                res.cookie("token", token, {
                    httpOnly: false,     
                    secure: false,      
                    sameSite: "lax", 
                    maxAge: 24 * 60 * 60 * 1000 
                });

                return res.json({ msg: "Signin successful" });
            } else {
                return res.status(400).json({ error: "Invalid password" });
            }

        } catch (err) {
            console.log("Error during signin:", err);
            return res.status(500).json({ error: "Password comparison failed" });
        }
    });
};

module.exports = { signup, signin };
