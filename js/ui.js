import { criarUsuario, listarUsuarios, editarUsuario, deletarUsuario } from './crud.js';
import { buscarUsuarioPorId } from './storage.js';

let modoEdicao = false;

/**
 * Inicializa a interface do usuário
 */
export function setupUI() {
    // Configurar o formulário
    const form = document.getElementById('userForm');
    const btnCancelar = document.getElementById('cancelEdit');
    
    // Manipular o envio do formulário
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        processarFormulario();
    });
    
    // Botão de cancelar edição
    btnCancelar.addEventListener('click', () => {
        limparFormulario();
    });
    
    // Carregar a lista inicial de usuários
    renderizarListaUsuarios();
}

/**
 * Processa o envio do formulário (criar ou editar usuário)
 */
function processarFormulario() {
    const usuarioId = document.getElementById('userId').value;
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    
    try {
        if (modoEdicao && usuarioId) {
            // Modo edição
            editarUsuario(Number(usuarioId), nome, email);
            mostrarAlerta('Usuário atualizado com sucesso!', 'success');
        } else {
            // Modo criação
            criarUsuario(nome, email);
            mostrarAlerta('Usuário criado com sucesso!', 'success');
        }
        
        limparFormulario();
        renderizarListaUsuarios();
    } catch (error) {
        mostrarAlerta(error.message, 'error');
    }
}

/**
 * Renderiza a lista de usuários na tabela
 */
function renderizarListaUsuarios() {
    const usuarios = listarUsuarios();
    const tbody = document.getElementById('userTableBody');
    const emptyMessage = document.getElementById('emptyMessage');
    const table = document.getElementById('userTable');
    
    // Limpar tabela existente
    tbody.innerHTML = '';
    
    // Mostrar mensagem de lista vazia ou a tabela
    if (usuarios.length === 0) {
        table.classList.add('hidden');
        emptyMessage.classList.remove('hidden');
    } else {
        table.classList.remove('hidden');
        emptyMessage.classList.add('hidden');
        
        // Preencher tabela com usuários
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td class="actions">
                    <button class="edit" data-id="${usuario.id}">Editar</button>
                    <button class="delete" data-id="${usuario.id}">Excluir</button>
                </td>
            `;
            
            // Configurar botões de ação
            configBotaoEditar(tr.querySelector('.edit'));
            configBotaoExcluir(tr.querySelector('.delete'));
            
            tbody.appendChild(tr);
        });
    }
}

/**
 * Configura o botão de editar
 * @param {HTMLElement} botao - Botão de editar
 */
function configBotaoEditar(botao) {
    botao.addEventListener('click', () => {
        const usuarioId = Number(botao.getAttribute('data-id'));
        carregarDadosParaEdicao(usuarioId);
    });
}

/**
 * Configura o botão de excluir
 * @param {HTMLElement} botao - Botão de excluir
 */
function configBotaoExcluir(botao) {
    botao.addEventListener('click', () => {
        const usuarioId = Number(botao.getAttribute('data-id'));
        if (confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                deletarUsuario(usuarioId);
                mostrarAlerta('Usuário excluído com sucesso!', 'success');
                renderizarListaUsuarios();
            } catch (error) {
                mostrarAlerta(error.message, 'error');
            }
        }
    });
}

/**
 * Carrega os dados do usuário para o formulário de edição
 * @param {number} usuarioId - ID do usuário a ser editado
 */
function carregarDadosParaEdicao(usuarioId) {
    const usuario = buscarUsuarioPorId(usuarioId);
    
    if (usuario) {
        document.getElementById('userId').value = usuario.id;
        document.getElementById('nome').value = usuario.nome;
        document.getElementById('email').value = usuario.email;
        
        // Mudar para modo de edição
        modoEdicao = true;
        document.getElementById('btnSalvar').textContent = 'Atualizar';
        document.getElementById('cancelEdit').classList.remove('hidden');
        
        // Focar no campo nome
        document.getElementById('nome').focus();
    }
}

/**
 * Limpa o formulário e retorna ao modo de criação
 */
function limparFormulario() {
    document.getElementById('userForm').reset();
    document.getElementById('userId').value = '';
    document.getElementById('btnSalvar').textContent = 'Salvar';
    document.getElementById('cancelEdit').classList.add('hidden');
    modoEdicao = false;
}

/**
 * Mostra uma mensagem de alerta
 * @param {string} mensagem - Mensagem a ser exibida
 * @param {string} tipo - Tipo de alerta ('error' ou 'success')
 */
function mostrarAlerta(mensagem, tipo) {
    const alertBox = document.getElementById('alertBox');
    
    alertBox.textContent = mensagem;
    alertBox.className = `alert ${tipo}`;
    alertBox.style.display = 'block';
    
    // Esconder o alerta após alguns segundos
    setTimeout(() => {
        alertBox.style.display = 'none';
    }, 3000);
}