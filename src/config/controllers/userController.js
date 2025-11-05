import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Registrar novo usuário
export const registerUser = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "Usuário já existe" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const user = await User.create({ nome, email, senha: hashedPassword });

    res.status(201).json({ msg: "Usuário criado com sucesso!", user });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao criar usuário", error });
  }
};

// Login do usuário
export const loginUser = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "Usuário não encontrado" });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(400).json({ msg: "Senha incorreta" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, nome: user.nome, email: user.email } });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao fazer login", error });
  }
};
