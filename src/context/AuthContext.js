import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Usuários iniciais para demonstração
const USUARIOS_INICIAIS = [
  { id: 1, nome: 'Admin', email: 'admin@teste.com', senha: '123', cargo: 'admin' },
  { id: 2, nome: 'Gestor', email: 'gestor@teste.com', senha: '123', cargo: 'gestor' },
  { id: 3, nome: 'Usuário', email: 'usuario@teste.com', senha: '123', cargo: 'user' }
];

export function AuthProvider({ children }) {
  const [usuarios, setUsuarios] = useState(() => {
    const usuariosSalvos = localStorage.getItem('usuarios');
    return usuariosSalvos ? JSON.parse(usuariosSalvos) : USUARIOS_INICIAIS;
  });
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica se há um usuário salvo no localStorage
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
    }
    setLoading(false);
  }, []);

  // Salva usuários no localStorage quando houver mudanças
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  const login = (email, senha) => {
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    
    if (usuario) {
      const { senha, ...usuarioSemSenha } = usuario;
      setUsuarioLogado(usuarioSemSenha);
      localStorage.setItem('usuario', JSON.stringify(usuarioSemSenha));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('usuario');
  };

  const cadastrarUsuario = (novoUsuario) => {
    if (usuarios.some(u => u.email === novoUsuario.email)) {
      throw new Error('E-mail já cadastrado');
    }

    const usuario = {
      ...novoUsuario,
      id: Date.now().toString()
    };

    setUsuarios(prev => [...prev, usuario]);
  };

  const editarUsuario = (usuarioEditado) => {
    const index = usuarios.findIndex(u => u.id === usuarioEditado.id);
    if (index === -1) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se o e-mail já está em uso por outro usuário
    if (usuarios.some(u => u.email === usuarioEditado.email && u.id !== usuarioEditado.id)) {
      throw new Error('E-mail já cadastrado');
    }

    const usuarioAtualizado = {
      ...usuarios[index],
      ...usuarioEditado,
      // Mantém a senha atual se não foi fornecida uma nova
      senha: usuarioEditado.senha || usuarios[index].senha
    };

    const novosUsuarios = [...usuarios];
    novosUsuarios[index] = usuarioAtualizado;
    setUsuarios(novosUsuarios);

    // Atualiza o usuário logado se for o mesmo
    if (usuarioLogado && usuarioLogado.id === usuarioEditado.id) {
      const { senha, ...usuarioSemSenha } = usuarioAtualizado;
      setUsuarioLogado(usuarioSemSenha);
      localStorage.setItem('usuario', JSON.stringify(usuarioSemSenha));
    }
  };

  const removerUsuario = (id) => {
    if (usuarioLogado && usuarioLogado.id === id) {
      throw new Error('Não é possível remover o próprio usuário');
    }
    setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const temPermissao = (permissao) => {
    if (!usuarioLogado) return false;
    if (usuarioLogado.cargo === 'admin') return true;
    if (usuarioLogado.cargo === 'gestor') {
      // Permissões do gestor
      const permissoesGestor = [
        'visualizar',
        'criar_bem', 'editar_bem', 'excluir_bem',
        'criar_conferencia', 'editar_conferencia', 'excluir_conferencia',
      ];
      return permissoesGestor.includes(permissao);
    }
    if (usuarioLogado.cargo === 'user') {
      // Usuário só pode visualizar
      return permissao === 'visualizar';
    }
    return false;
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{
      usuarioLogado,
      usuarios,
      login,
      logout,
      cadastrarUsuario,
      editarUsuario,
      removerUsuario,
      temPermissao
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
} 