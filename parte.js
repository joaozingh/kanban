// criar card
function criarCard(colunaId) {
  const texto = prompt("Digite o texto do card:");
  if (!texto) return;

  criarCardComTexto(colunaId, texto);
  salvarEstado();
}

// criar card com texto (usado no load)
function criarCardComTexto(colunaId, texto) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
    <span class="texto">${texto}</span>
    <div class="acoes">
      <button class="editar">✏</button>
      <button class="excluir">❌</button>
    </div>
  `;

  adicionarEventos(card);
  document.getElementById(colunaId).appendChild(card);
}

let ultimoToque = 0;

function adicionarEventos(card) {
  const texto = card.querySelector(".texto");
  const btnEditar = card.querySelector(".editar");
  const btnExcluir = card.querySelector(".excluir");

  // editar pelo botão (continua funcionando)
  btnEditar.addEventListener("click", () => {
    editarTexto(texto);
  });

  // duplo clique (PC)
  card.addEventListener("dblclick", () => {
    editarTexto(texto);
  });

  // duplo toque (celular)
  card.addEventListener("touchend", () => {
    const agora = new Date().getTime();
    const diferenca = agora - ultimoToque;

    if (diferenca < 300 && diferenca > 0) {
      editarTexto(texto);
    }

    ultimoToque = agora;
  });

  // excluir
  btnExcluir.addEventListener("click", () => {
    card.remove();
    salvarEstado();
  });
}

// função separada (melhor prática)
function editarTexto(texto) {
  const novoTexto = prompt("Editar:", texto.textContent);
  if (novoTexto) {
    texto.textContent = novoTexto;
    salvarEstado();
  }
}

// drag moderno (funciona PC + celular)
document.querySelectorAll(".coluna").forEach(coluna => {
  new Sortable(coluna, {
    group: "kanban",
    animation: 150,
    ghostClass: "dragging",
    onEnd: salvarEstado
  });
});

// salvar estado
function salvarEstado() {
  const dados = {};

  document.querySelectorAll(".coluna").forEach(coluna => {
    const id = coluna.id;
    dados[id] = [];

    coluna.querySelectorAll(".card .texto").forEach(card => {
      dados[id].push(card.textContent);
    });
  });

  localStorage.setItem("kanban", JSON.stringify(dados));
}

// carregar estado
function carregarEstado() {
  const dados = JSON.parse(localStorage.getItem("kanban"));
  if (!dados) return;

  for (let colunaId in dados) {
    dados[colunaId].forEach(texto => {
      criarCardComTexto(colunaId, texto);
    });
  }
}

carregarEstado();