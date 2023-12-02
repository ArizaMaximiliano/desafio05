import { Router } from 'express';
import UserModel from '../../models/userModel.js';

const router = Router();

router.post('/sessions/register', async (req, res) => {         //REGISTER
    const { body } = req;

    if (!body.email || !body.password) {
        return res.status(400).send('Correo/contraseña faltante');
    }

    try {
        const newUser = await UserModel.create(body);
        console.log('newUser', newUser);
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.post('/sessions/login', async (req, res) => {            //LOGIN
    const { body: { email, password } } = req;

    if (!email || !password) {
        return res.status(400).send('Correo/contraseña faltante');
    }

    try {
        if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
            req.session.user = { email, role: 'admin' };
            res.redirect('/api/products');
        } else {
            let user = await UserModel.findOne({ email });

            if (!user || user.password !== password) {
                return res.status(401).send('Correo/contraseña inválidos');
            }
            const { firstName, lastName } = user;

            req.session.user = { email, role: 'usuario', firstName, lastName };
            res.redirect('/api/products');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Error interno del servidor');
        }
        res.redirect('/login');
    });
});

export default router;
