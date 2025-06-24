# Bagg.io - Sistema de Gestão Patrimonial

Este projeto é um sistema web para gestão de bens patrimoniais, conferências, movimentações, usuários e filiais, com importação/exportação de planilhas no padrão migratório.

## Funcionalidades Principais

- **Gestão de Bens**
  - Cadastro, edição, exclusão e transferência de bens
  - Importação e exportação de bens em formato XLSX (modelo migratório)
  - Filtros por filial
  - **Baixa de bens**: botão exclusivo para dar baixa, com pop-up obrigatório de justificativa
  - **Destaque visual**: bens baixados ficam com linha vermelha (ou escura no dark mode) e exibem motivo/data da baixa
  - **Pop-up de confirmação**: toda exclusão de bem exige confirmação do usuário
- **Importação/Exportação de Bens**
  - Importe bens a partir de uma planilha XLSX com as colunas:
    - Filial, Nome, Número Patrimonial, Início de uso, Data de Aquisição, Valor, Status, Fornecedor, Nº da Nota
  - Exporte todos os bens cadastrados nesse mesmo formato para facilitar migração entre sistemas
- **Módulo de Conferência Patrimonial**
  - Crie conferências por filial e usuário
  - Faça a conferência dos bens lendo a plaqueta ou digitando
  - Cards informativos de status: Conferidos, Não conferidos, Não localizado, Transferidos, Baixados
  - **Chips informativos**: Transferidos (quando observação for "Cadastrado em outra filial"), Baixados, etc.
  - Marque observações como "Baixado", "Não localizado" ou "Cadastrado em outra filial"
  - Finalize ou exclua conferências
- **Gestão de Usuários**
  - Cadastro, edição, exclusão e permissões (admin/gestor/usuário)
- **Gestão de Filiais**
  - Cadastro, edição (nome, endereço, contato, cidade, CEP) e exclusão de filiais
  - A primeira filial criada é marcada como "Sede"
- **Movimentações**
  - Histórico de transferências e baixas de bens entre filiais
- **Dashboard**
  - Estatísticas de bens, valor total, gráficos e resumo por filial
- **Login e Permissões**
  - Login com controle de sessão e permissões de acesso
- **Tema Personalizado**
  - Visual moderno, dark/light mode com alternância no topo
  - Responsivo para mobile e desktop

## Responsividade e Uso Mobile
- O sistema é totalmente responsivo:
  - Tabelas possuem rolagem horizontal em telas pequenas
  - Colunas menos importantes são ocultadas no mobile
  - Cards, grids e botões se adaptam para uso confortável em celulares e tablets
- Para testar no mobile:
  1. Use o modo dispositivo do navegador (F12 > ícone de celular)
  2. Ou acesse pelo celular usando o IP local do seu computador

## Como dar baixa em um bem
1. Clique no botão "Baixa" ao final da linha do bem desejado
2. Preencha a justificativa obrigatória no pop-up
3. O bem será destacado e a data/motivo da baixa ficarão registrados

## Como importar bens de uma planilha
1. Clique em "Importar" na tela de bens
2. Selecione um arquivo XLSX com as colunas: Filial, Nome, Número Patrimonial, Início de uso, Data de Aquisição, Valor, Status, Fornecedor, Nº da Nota
3. Os bens serão cadastrados automaticamente

## Como exportar bens para planilha
1. Clique em "Exportar" na tela de bens
2. O arquivo XLSX será baixado no mesmo formato do modelo migratório

## Como usar o módulo de conferência
1. Acesse "Conferências" no menu lateral
2. Clique em "Nova Conferência", selecione a filial e inicie
3. Faça a conferência lendo ou digitando a plaqueta dos bens
4. Se escanear um item de outra filial, marque a observação como "Cadastrado em outra filial" para que ele seja considerado transferido
5. Se escanear um item baixado, marque como "Baixado"
6. Marque observações conforme necessário
7. Finalize ou exclua a conferência quando desejar

## Perfis e Permissões

O sistema possui três tipos de usuários, cada um com permissões específicas:

- **Admin**
  - Acesso total a todas as funcionalidades
  - Pode cadastrar, editar e excluir usuários e filiais
  - Pode cadastrar, editar, excluir bens e conferências
  - Visualiza todos os menus
 

- **Gestor**
  - Pode cadastrar, editar e excluir bens e conferências
  - NÃO pode cadastrar, editar ou excluir usuários e filiais
  - Não visualiza os menus de "Usuários" e "Configurações"
 

- **Usuário**
  - Apenas visualiza bens, conferências, movimentações, filiais e usuários
  - NÃO pode cadastrar, editar ou excluir nada
  - Não visualiza botões de ação (Novo, Editar, Excluir, Importar, Exportar, etc.)
  

## Créditos
Desenvolvido por Erik Domingos Candido

Contato: erikcandido93@gmail.com
