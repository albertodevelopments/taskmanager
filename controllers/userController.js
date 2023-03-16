'use strict';

// Cargamos las dependencias necesarias
const User = require('../models/User');
const bcryptjs = require('bcryptjs'); // Para hashear el password
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
    // Extraemos email y password para las validaciones y hash
    const { email, password } = req.body;

    try {
        // Validamos que no exista otro usuario con ese e-mail
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'Email already in use' });
        }

        // Creamos el nuevo usuario
        user = new User(req.body);

        // Hasheamos el password
        const salt = await bcryptjs.genSalt(10);
        user.password = bcryptjs.hashSync(password, salt);

        // Guardamos el usuario con el password encriptado
        await user.save();

        // Creamos el JWT y firmamos con él a partir del id del usuario
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 604800 // 1 semana
            }, // Obtenemos el token generado con la firma del id
            (error, token) => {
                if (error) throw error;

                // Devolvemos el token de confirmación si todo ha ido bien
                res.json({ token });
            }
        );
    } catch (error) {
        console.log(error);
        res.status(400).send('An error has ocurred');
    }
};

exports.login = async (req, res) => {
    // Extraemos email y password para las validaciones y hash
    const { email, password } = req.body;

    try {
        // Verificamos que el usuario exista
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'This account does not exist' });
        }

        // Verificamos que la contraseña sea correcta
        const passwordOk = await bcryptjs.compare(password, user.password);
        if (!passwordOk) {
            return res.status(400).json({ msg: 'Wrong password' });
        }

        // Si todo es correcto, crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.SECRET,
            {
                expiresIn: 604800 // 1 semana
            }, // Obtenemos el token generado con la firma del id
            (error, token) => {
                if (error) throw error;

                // Devolvemos el token de confirmación si todo ha ido bien
                res.json({ token });
            }
        );
    } catch (error) {
        console.log(error);
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'Authentication error' });
    }
};
