# 🖥️ PC Builder Simulator

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## 🎯 Objetivo do Projeto

O **PC Builder Simulator** é uma aplicação web interativa desenvolvida para auxiliar jovens de 15 a 24 anos na montagem de computadores personalizados de acordo com seu perfil de uso (**Trabalho, Doméstico, Jogos ou Híbrido**). 

O sistema guia o usuário passo a passo na escolha dos componentes, realizando o **cálculo de orçamento em tempo real** e a **validação automática de compatibilidade de hardware** (soquete de CPU/Placa-Mãe, geração de memória RAM, potência da fonte em Watts e dimensões físicas do gabinete).

---

## 📂 Arquitetura do Projeto

A estrutura de diretórios foi modularizada em `public/` (dados e mídias estáticas) e `src/` (código-fonte) para permitir o trabalho simultâneo das equipes sem conflitos de merge no GitHub:

```text
Pc-builder/
├── index.html                      # Ponto de entrada da aplicação
├── README.md                       # Documentação do projeto
├── public/                         # Arquivos estáticos
│   ├── data/
│   │   └── hardware-parts.json     # Base de dados das peças
│   └── assets/
│       └── img/                    # Imagens de hardware e ícones da interface
└── src/                            # Código-fonte da aplicação
    ├── css/
    │   ├── global.css              # Variáveis, reset e estilos base
    │   ├── setup.css               # Estilos das telas de Finalidade e Orçamento
    │   └── builder.css             # Estilos do Catálogo, Cards e Resumo
    └── js/
        ├── main.js                 # Inicialização, controle de estado e navegação
        ├── compatibility.js        # Cálculo de custo e regras de compatibilidade
        └── ui/                     # Renderização de telas e eventos de DOM
            ├── setup-view.js       # Lógica visual: Finalidade e Orçamento
            ├── catalog-view.js     # Renderização dos cards, filtros e seleção
            └── summary-view.js     # Barra de progresso do orçamento e tela final
```

---

## 📍 Guia de Diretórios: Onde cada grupo deve colocar seus arquivos

Para manter a organização do repositório e evitar conflitos de código, cada equipe e frente de desenvolvimento deve alocar seus entregáveis exclusivamente nos caminhos abaixo:

### 1. Equipe de Roteiro e Documentação (Dados e Mídias)
* **`public/data/hardware-parts.json`**: Base de dados estruturada contendo as 7 categorias de peças, preços, especificações, perfis recomendados e tags de compatibilidade.
* **`public/assets/img/`**: Imagens das peças de hardware (com nomes padronizados correspondentes ao JSON) e ícones da interface.

### 2. Equipe de Desenvolvimento — Estilização (CSS3)
* **`src/css/global.css`**: Variáveis de tema (cores, tipografia), reset de página e estilos base da identidade visual.
* **`src/css/setup.css`**: Estilização exclusiva das telas iniciais (Seleção de Finalidade e Definição de Orçamento).
* **`src/css/builder.css`**: Estilização do catálogo de peças, cards de componentes, barra de progresso e tela de resumo final.

### 3. Equipe de Desenvolvimento — Arquitetura, Lógica e Interface (JavaScript ES6+)
* **`index.html` e `src/js/main.js`** *(Líder Técnico & Integração)*: Estrutura principal das telas, inicialização da aplicação, gerenciamento de estado global e navegação entre etapas.
* **`src/js/compatibility.js`** *(Dev de Lógica e Compatibilidade)*: Regras de negócio, soma do custo total, verificação de estouro de orçamento e validações técnicas (CPU/Placa-Mãe, DDR4/DDR5, Consumo vs. Fonte e Formato do Gabinete).
* **`src/js/ui/setup-view.js`** *(Dev Front-End — Telas Iniciais)*: Manipulação de DOM, eventos e validação de entrada das telas de Finalidade e Orçamento.
* **`src/js/ui/catalog-view.js`** *(Dev Front-End — Catálogo)*: Renderização dinâmica dos cards a partir do JSON, filtros por etapa e seleção de peças.
* **`src/js/ui/summary-view.js`** *(Dev Front-End — Resumo)*: Atualização visual da barra de orçamento em tempo real, alertas de incompatibilidade na tela e exibição do resumo final da montagem.

---

## ⚖️ Licença

Este projeto está sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
