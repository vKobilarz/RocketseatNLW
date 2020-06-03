## 📄 Projeto
Este projeto foi desenvolvido com o propósito de acompanhamento da Next Level Week, Rocketseat. Seu propósito é ligar empresas / entidades que coletam resíduos a pessoas que fazem o seu descarte.

## 🚀 Tecnologias
* Frontend: Reactjs
* Backend: Node.js
* Mobile: React Native

## ⤴️ Rotas backend
### Itens de coleta
* GET    /items: Lista todos os itens.
* GET    /items/[id]: Busca o item de coleta com o ID informado.
* POST   /items: Cria um novo item de coleta.
* PUT    /items/[id]: Edita o item de coleta com o ID informado.
* DELETE /items/[id]: Remove o item de coletacom o ID informado.

### Pontos de coleta
* GET    /points: Lista todos os pontos de coleta. Pode ser realizado filtros por UF, cidade e itens de coleta.
* GET    /items/[id]: Busca o ponto de coleta com o ID informado.
