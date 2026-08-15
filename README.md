# 🪨 Marmoraria Nova Canaã

Aplicação web desenvolvida para a **Marmoraria Nova Canaã**, com o objetivo de apresentar os serviços e produtos da empresa e disponibilizar uma área para gerenciamento de **orçamentos de clientes**.

O projeto foi desenvolvido utilizando **HTML, CSS e JavaScript**, aplicando conceitos de desenvolvimento web, organização de interfaces e manipulação dinâmica de elementos da página.

## 📌 Sobre o projeto

O sistema possui duas áreas principais:

### 👥 Área institucional

Permite que o visitante:

* Conheça a Marmoraria Nova Canaã;
* Visualize os produtos e materiais disponíveis;
* Consulte informações sobre as pedras;
* Visualize avaliações de clientes;
* Entre em contato com a empresa;
* Solicite informações sobre produtos pelo WhatsApp.

### 👨‍💼 Área de orçamentos

A aplicação possui uma área para gerenciamento de orçamentos, permitindo:

* Criar novos orçamentos;
* Editar orçamentos;
* Visualizar informações dos clientes;
* Informar materiais e acabamentos;
* Definir datas de orçamento e entrega;
* Registrar valores de entrada e restante;
* Alterar o status do orçamento;
* Arquivar orçamentos;
* Filtrar orçamentos por status;
* Visualizar o valor total.

## 🖥️ Funcionalidades

### 🏠 Página inicial

A página institucional apresenta informações sobre a empresa e seus serviços, divididas nas seguintes seções:

* **Home**
* **Sobre**
* **Produtos**
* **Avaliações**
* **Contato**

A seção de produtos apresenta diferentes tipos de pedras, incluindo:

* Granito Branco Dallas;
* Granito Imperial Coffee;
* Granito Ubatuba.

Também existem opções de contato para solicitar informações sobre os produtos.

### 🔐 Login

O projeto possui uma tela de login para acesso à área de gerenciamento de orçamentos.

A validação das credenciais é realizada utilizando JavaScript.

### 💰 Gerenciamento de orçamentos

A área de orçamentos permite cadastrar informações como:

* Cliente;
* Endereço;
* Telefone;
* Data do orçamento;
* Descrição;
* Material;
* Acabamento;
* Cuba;
* Vista;
* Saia;
* Data de entrega;
* Entrada;
* Valor restante;
* Status.

Os orçamentos são organizados de acordo com seu status:

* 🟢 **Aberto**
* 🔵 **Confirmado**
* ⚫ **Arquivado**

Também é possível filtrar os registros por:

```text
Geral
Abertos
Confirmados
Arquivados
```

## ⚙️ JavaScript

O JavaScript é responsável pelas funcionalidades interativas da aplicação.

Entre elas:

* Validação do login;
* Redirecionamento entre páginas;
* Criação de orçamentos;
* Edição de orçamentos;
* Alteração de status;
* Arquivamento;
* Filtragem;
* Cálculo e atualização de valores;
* Manipulação dinâmica dos elementos da página;
* Formatação de datas;
* Exibição e ocultação de informações.

## 🛠️ Tecnologias utilizadas

* 🌐 **HTML5**
* 🎨 **CSS3**
* ⚡ **JavaScript**
* 💬 **WhatsApp**
* 🔧 **Git**
* 🐙 **GitHub**

## 📂 Estrutura do projeto

```text
Marmoraria-Nova-Canaa/
│
├── assets/
│   ├── css/
│   │   ├── index.css
│   │   ├── login.css
│   │   ├── orcamento.css
│   │   └── style.css
│   │
│   ├── img/
│   │   ├── logo.png
│   │   ├── background_login.png
│   │   ├── granito-White-Dallas.jpg
│   │   ├── granito-Imperial-Coffee1.jpg
│   │   ├── granito-Ubatuba1.jpg
│   │   └── ...
│   │
│   └── js/
│       ├── login.js
│       └── orcamentos.js
│
├── index.html
├── login.html
├── orcamentos.html
│
└── README.md
```

## 📄 Principais arquivos

### `index.html`

Página institucional da Marmoraria Nova Canaã, apresentando a empresa, produtos, avaliações e informações de contato.

### `login.html`

Página de login para acesso à área de gerenciamento.

### `orcamentos.html`

Interface responsável pelo gerenciamento dos orçamentos.

### `login.js`

Responsável pela validação do login e pelo direcionamento do usuário para a área de orçamentos.

### `orcamentos.js`

Contém a lógica de gerenciamento dos orçamentos, incluindo criação, edição, filtros, alteração de status e atualização dos valores.

### Arquivos CSS

Os estilos da aplicação são organizados em diferentes arquivos:

* `index.css`
* `login.css`
* `orcamento.css`
* `style.css`

## ▶️ Como executar

Não são necessárias dependências externas para executar o projeto.

### 1. Clone o repositório

```bash
git clone https://github.com/caroldvlribeiro/Marmoraria-Nova-Canaa.git
```

### 2. Acesse a pasta

```bash
cd Marmoraria-Nova-Canaa
```

### 3. Execute

Abra o arquivo `index.html` no navegador.

Durante o desenvolvimento, também pode ser utilizado o **Live Server** no Visual Studio Code.

## 🎓 Contexto acadêmico

Projeto desenvolvido como parte das atividades do **Ciclo 1 de Desenvolvimento Web** do curso de **Desenvolvimento de Software Multiplataforma**.

**Instituição:** FATEC Praia Grande

⭐ Projeto desenvolvido para fins acadêmicos e de aprendizado em desenvolvimento web.
