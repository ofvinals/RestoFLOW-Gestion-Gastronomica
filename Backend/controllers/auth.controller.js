const createAccessToken = require('../libs/jwt.js');
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const Jwt = require('jsonwebtoken');

const login = async (req, res) => {
	console.log(req.body)
	try {
		const { email, password } = req.body;
		const userFound = await User.findOne({ email });
console.log(userFound)
		// Validacion usuario y contraseña por backend
		if (!userFound)
			return res.status(400).json({
				message: ['El mail y/o contraseña son incorrectos'],
			});

		const isMatch = await bcrypt.compare(password, userFound.password);
		if (!isMatch)
			return res.status(400).json({
				message: ['El mail y/o contraseña son incorrectos'],
			});

		// genera el token
		const token = await createAccessToken({
			id: userFound._id,
			displayName: `${userFound.name} ${userFound.subname}`,
			email: userFound.email,
			rol: userFound.rol,
			status:userFound.status
		});

		res.cookie('token', token);

		// envia respuesta al frontend
		return res.status(200).json({
			id: userFound._id,
			displayName: `${userFound.name} ${userFound.subname}`,
			accessToken: token,
			rol: userFound.rol,
			status:userFound.status
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json(['Error de Ingreso']);
	}
};

const logout = (req, res) => {
	res.cookie('token', '', { expires: new Date(0) });
	return res.sendStatus(200);
};

const profile = async (req, res) => {
	const userFound = await User.findById(req.user.id);
	if (!userFound) return res.status(400).json(['Usuario no encontrado']);

	return res.json({
		id: userFound._id,
		email: userFound.email,
		createdAt: userFound.createdAt,
	});
};

const verifyToken = async (req, res) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.send(false);

	Jwt.verify(token, process.env.TOKEN_SECRET, async (error, user) => {
		if (error) return res.status(401).json(['No autorizado']);

		const userFound = await User.findById(user.id);
		if (!userFound) return res.status(401).json(['No autorizado']);

		return res.json({
			id: userFound._id,
			email: userFound.email,
			displayName: `${userFound.name} ${userFound.subname}`,
			token: token,
			rol: userFound.rol,
			status: userFound.status
		});
	});
};

module.exports = {
	login,
	logout,
	profile,
	verifyToken,
};
