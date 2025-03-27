# API de Top Tracks do Spotify

Este projeto oferece uma API que consulta as músicas mais populares de um artista diretamente do Spotify. Através da interface simples, o usuário pode pesquisar o nome do artista e visualizar suas faixas mais populares.

## Funcionalidades

- Buscar o nome do artista e obter suas músicas mais populares.
- Exibir uma lista das faixas mais populares diretamente na interface.
- A API é independente, ou seja, ao fazer a mesma consulta mais de uma vez, os dados serão retornados a partir da própria API (não precisando fazer uma nova consulta ao Spotify).

## Tecnologias Utilizadas

- **Node.js**: Plataforma utilizada para rodar a API.
- **Express**: Framework utilizado para criar as rotas da API.
- **Axios**: Biblioteca utilizada para fazer requisições HTTP.
- **Spotify API**: Usada para consultar as faixas populares de artistas.
- **HTML/CSS**: Para a construção do front-end e da interface simples de pesquisa.

## Como Rodar o Projeto

1. Clone o repositório:

    
bash
    git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git


2. Instale as dependências:

    
bash
    cd nome-do-projeto
    npm install


3. Crie um arquivo .env na raiz do projeto e adicione suas credenciais do Spotify:

    
plaintext
    SPOTIFY_CLIENT_ID=seu_client_id
    SPOTIFY_CLIENT_SECRET=seu_client_secret
    SPOTIFY_REDIRECT_URI=sua_redirect_uri


4. Inicie o servidor:

    
bash
    node server.js


5. Acesse o projeto no navegador através do endereço:

    
http://localhost:3000


## Demonstração visual do projeto
![Demonstração da busca de faixas no aplicativo](https://res.cloudinary.com/df2x2abpp/image/upload/v1743096947/Anima%C3%A7%C3%A3o_sdczda.gif)


## Contribuições

Contribuições são bem-vindas! Se você tiver sugestões ou correções, fique à vontade para abrir um pull request.

## Licença

Este projeto está licenciado sob a MIT License - veja o [LICENSE](LICENSE) para mais detalhes.
