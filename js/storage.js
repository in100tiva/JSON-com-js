/**
 * Obtém a lista de usuários do localStorage
 * @returns {Array} Lista de usuários ou array vazio se nenhum usuário for encontrado
 */
export function obterUsuarios() {
  try {
    const dados = localStorage.getItem('usuarios');
    return dados ? JSON.parse(dados) : [];
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    return [];
  }
}

/**
 * Salva a lista de usuários no localStorage
 * @param {Array} usuarios - Lista de usuários a ser salva
 * @returns {boolean} - Verdadeiro se foi salvo com sucesso, falso caso contrário
 */
export function salvarUsuarios(usuarios) {
  try {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    return true;
  } catch (error) {
    console.error('Erro ao salvar usuários:', error);
    return false;
  }
}

/**
 * Busca um usuário específico pelo ID
 * @param {number} id - ID do usuário a ser buscado
 * @returns {Object|null} - Objeto do usuário encontrado ou null se não encontrado
 */
export function buscarUsuarioPorId(id) {
  const usuarios = obterUsuarios();
  return usuarios.find(usuario => usuario.id === id) || null;
}