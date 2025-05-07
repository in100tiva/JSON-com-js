import { obterUsuarios, salvarUsuarios, buscarUsuarioPorId } from "./storage.js";

/**
 * Cria um novo usuário e adiciona à lista
 * @param {string} nome - Nome do usuário
 * @param {string} email - Email do usuário
 * @returns {Object|null} - Novo usuário criado ou null em caso de erro
 */
export function criarUsuario(nome, email) {
  try {
    // Validação básica
    if (!nome || !email) {
      throw new Error('Nome e email são obrigatórios');
    }
    
    if (!validarEmail(email)) {
      throw new Error('Email inválido');
    }
    
    const usuarios = obterUsuarios();
    
    // Verificar se o email já existe
    if (usuarios.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Este email já está cadastrado');
    }
    
    const novoUsuario = {
      id: Date.now(),
      nome: nome.trim(),
      email: email.trim(),
      dataCriacao: new Date().toISOString()
    };

    usuarios.push(novoUsuario);
    const sucesso = salvarUsuarios(usuarios);
    
    return sucesso ? novoUsuario : null;
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
}

/**
 * Lista todos os usuários cadastrados
 * @returns {Array} - Lista de usuários
 */
export function listarUsuarios() {
  return obterUsuarios();
}

/**
 * Edita um usuário existente
 * @param {number} id - ID do usuário a ser editado
 * @param {string} novoNome - Novo nome do usuário
 * @param {string} novoEmail - Novo email do usuário
 * @returns {Object|null} - Usuário editado ou null se não encontrado/erro
 */
export function editarUsuario(id, novoNome, novoEmail) {
  try {
    // Validação básica
    if (!novoNome || !novoEmail) {
      throw new Error('Nome e email são obrigatórios');
    }
    
    if (!validarEmail(novoEmail)) {
      throw new Error('Email inválido');
    }
    
    const usuarios = obterUsuarios();
    const indice = usuarios.findIndex(u => u.id === id);
    
    if (indice === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    // Verificar se o novo email já existe em outro usuário
    const emailExistente = usuarios.find(u => 
      u.id !== id && u.email.toLowerCase() === novoEmail.toLowerCase()
    );
    
    if (emailExistente) {
      throw new Error('Este email já está cadastrado para outro usuário');
    }
    
    usuarios[indice] = {
      ...usuarios[indice],
      nome: novoNome.trim(),
      email: novoEmail.trim(),
      dataAtualizacao: new Date().toISOString()
    };
    
    const sucesso = salvarUsuarios(usuarios);
    return sucesso ? usuarios[indice] : null;
  } catch (error) {
    console.error('Erro ao editar usuário:', error);
    throw error;
  }
}

/**
 * Deleta um usuário pelo ID
 * @param {number} id - ID do usuário a ser deletado
 * @returns {boolean} - Verdadeiro se deletado com sucesso
 */
export function deletarUsuario(id) {
  try {
    let usuarios = obterUsuarios();
    const quantidadeAntes = usuarios.length;
    
    usuarios = usuarios.filter(u => u.id !== id);
    
    if (quantidadeAntes === usuarios.length) {
      throw new Error('Usuário não encontrado');
    }
    
    return salvarUsuarios(usuarios);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
}

/**
 * Valida um endereço de email
 * @param {string} email - Email a ser validado
 * @returns {boolean} - Verdadeiro se o email for válido
 */
function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}